import * as React from "react"
import { AchievementStatus } from "./AchievementStatus"
import {
    mockAchievementRepository,
    nextAchievementId,
    useAchievementRecords,
} from "../data/achievementRepository"
import type {
    AchievementId,
    AchievementRecord,
    AchievementStatus as AchievementStatusValue,
} from "../data/achievementTypes"
import {
    ACHIEVEMENTS_PATH,
    achievementDetailPath,
    formatAchievementDate,
} from "../utils/achievementRoutes"
import "./AchievementStyles.css"

export interface AchievementRecordEditorProps {
    mode?: "new" | "edit"
    recordId?: AchievementId
    style?: React.CSSProperties
}

interface AchievementForm {
    title: string
    category: string
    organization: string
    date: string
    role: string
    description: string
    skills: string
    evidenceUrl: string
}

type FormErrors = Record<string, string>

const categories = ["competition", "recognition", "academic", "service"]

const emptyForm: AchievementForm = {
    title: "",
    category: "",
    organization: "",
    date: "",
    role: "",
    description: "",
    skills: "",
    evidenceUrl: "",
}

function routeValues(): { id: string; mode: "new" | "edit" } {
    if (typeof window === "undefined") return { id: "", mode: "new" }
    const query = new URLSearchParams(window.location.search)
    const id = query.get("record") || ""
    return { id, mode: id ? "edit" : "new" }
}

function formFromRecord(record?: AchievementRecord): AchievementForm {
    if (!record) return emptyForm
    return {
        title: record.title || "",
        category: record.category || "",
        organization: record.organization || "",
        date: record.date || "",
        role: record.role || "",
        description: record.description || "",
        skills: (record.skills || []).join(", "),
        evidenceUrl: record.evidenceUrl || "",
    }
}

export function AchievementRecordEditor({
    mode: modeProp,
    recordId: recordIdProp,
    style,
}: AchievementRecordEditorProps): React.ReactElement {
    const records = useAchievementRecords()
    const initialRoute = React.useMemo(routeValues, [])
    const [mode, setMode] = React.useState<"new" | "edit">(
        modeProp || (recordIdProp || initialRoute.id ? "edit" : initialRoute.mode)
    )
    const [recordId, setRecordId] = React.useState(
        recordIdProp || initialRoute.id
    )
    const existing = records.find((item) => item.id === recordId)
    const [form, setForm] = React.useState<AchievementForm>(() =>
        formFromRecord(existing)
    )
    const [initialized, setInitialized] = React.useState(
        modeProp === "new" ||
            (!recordIdProp && !initialRoute.id) ||
            Boolean(existing)
    )
    const [errors, setErrors] = React.useState<FormErrors>({})
    const [showReview, setShowReview] = React.useState(false)
    const [success, setSuccess] = React.useState<{
        id: AchievementId
        status: AchievementStatusValue
    } | null>(null)
    const [localFile, setLocalFile] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState("")
    const [localProgress, setLocalProgress] = React.useState(0)

    React.useEffect(() => {
        if (initialized || mode !== "edit" || !existing) return
        setForm(formFromRecord(existing))
        setInitialized(true)
    }, [existing, initialized, mode])

    React.useEffect(() => {
        if (!localFile) return
        let progress = 0
        const timer = window.setInterval(() => {
            progress += 20
            setLocalProgress(Math.min(100, progress))
            if (progress >= 100) window.clearInterval(timer)
        }, 120)
        return () => window.clearInterval(timer)
    }, [localFile])

    React.useEffect(
        () => () => {
            if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
        },
        [previewUrl]
    )

    const readOnlyVerified =
        mode === "edit" && existing?.status === "verified"

    function updateField(key: keyof AchievementForm, value: string): void {
        setForm((previous) => ({ ...previous, [key]: value }))
        setErrors((previous) => ({ ...previous, [key]: "" }))
    }

    function validate(finalSubmit: boolean): FormErrors {
        const next: FormErrors = {}
        if (finalSubmit) {
            if (!form.title.trim()) next.title = "Title is required."
            if (!form.organization.trim())
                next.organization = "Organization is required."
            if (!form.category) next.category = "Category is required."
            if (!form.date) next.date = "Date is required."
        }
        if (form.evidenceUrl && !/^https?:\/\//i.test(form.evidenceUrl))
            next.evidenceUrl = "Use a valid http(s) URL."
        return next
    }

    function chooseFile(file: File | null): void {
        if (!file) return
        const allowedType = [
            "application/pdf",
            "image/png",
            "image/jpeg",
        ].includes(file.type)
        const allowedSize = file.size <= 10 * 1024 * 1024
        if (!allowedType || !allowedSize) {
            setErrors((previous) => ({
                ...previous,
                evidence: "Only PDF, PNG, JPG up to 10MB are allowed.",
            }))
            return
        }

        if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
        setLocalFile(file)
        setPreviewUrl(URL.createObjectURL(file))
        setLocalProgress(0)
        setErrors((previous) => ({ ...previous, evidence: "" }))
    }

    function submit(status: AchievementStatusValue): void {
        if (mode === "edit" && !existing) {
            setErrors({
                record:
                    "This record could not be found. Return to Achievements and open it again.",
            })
            return
        }

        const nextErrors = validate(status === "pending")
        setErrors(nextErrors)
        if (Object.values(nextErrors).some(Boolean)) return

        const id = mode === "edit" ? recordId : nextAchievementId(records)
        const previous = records.find((item) => item.id === id)
        const now = new Date().toISOString()
        const record: AchievementRecord = {
            id,
            type: "achievement",
            title: form.title.trim() || "Untitled record",
            category: (form.category || "competition") as AchievementRecord["category"],
            organization: form.organization.trim() || "Unknown organization",
            date: form.date || now.slice(0, 10),
            role: form.role.trim() || undefined,
            description: form.description.trim() || undefined,
            skills: form.skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            evidenceFileName: localFile?.name || previous?.evidenceFileName,
            evidenceUrl: form.evidenceUrl.trim() || undefined,
            submittedAt: previous?.submittedAt || now,
            status,
            rejectionReason:
                status === "pending" ? undefined : previous?.rejectionReason,
            statusHistory: [
                ...(previous?.statusHistory || []),
                {
                    status,
                    at: now,
                    by: "Amira Mansour",
                    note:
                        status === "draft"
                            ? "Saved locally as a draft."
                            : undefined,
                },
            ],
        }
        const result = mockAchievementRepository.save(record)
        if (!result.ok) {
            setErrors({ storage: result.error || "Could not save this record." })
            return
        }

        setRecordId(id)
        setMode("edit")
        setShowReview(false)
        setSuccess({ id, status })
        setErrors({})
    }

    if (mode === "edit" && !existing && initialized) {
        return (
            <section className="cxw cxw-achievements" style={style}>
                <div className="cxw-card">
                    <h1 className="cxw-title">We couldn’t find this record.</h1>
                    <a className="cxw-link" href={ACHIEVEMENTS_PATH}>
                        Back to Achievements
                    </a>
                </div>
            </section>
        )
    }

    return (
        <section
            className="cxw cxw-achievements"
            style={style}
            aria-label="Achievement record editor"
        >
            <p className="cxw-note">
                Browser-local prototype. Your preparation stays in this browser and is not uploaded.
            </p>

            {mode === "edit" && existing ? (
                <div className="cxw-achievement-editor-status">
                    <span className="cxw-note">Current status</span>
                    <AchievementStatus status={existing.status} />
                </div>
            ) : null}

            {readOnlyVerified ? (
                <div className="cxw-card" style={{ marginTop: 12 }}>
                    <p className="cxw-title">Verified records are read-only for members.</p>
                    <a
                        className="cxw-link"
                        href={achievementDetailPath(existing.id)}
                    >
                        Back to detail
                    </a>
                </div>
            ) : (
                <>
                    {existing?.status === "rejected" && existing.rejectionReason ? (
                        <div className="cxw-alert" style={{ marginTop: 12 }}>
                            <strong>Admin feedback:</strong> {existing.rejectionReason}
                        </div>
                    ) : null}

                    <div className="cxw-card" style={{ marginTop: 12 }}>
                        <h1 className="cxw-title">Achievement details</h1>
                        <div className="cxw-grid-two" style={{ marginTop: 10 }}>
                            <label className="cxw-label">
                                Title *
                                <input
                                    aria-invalid={Boolean(errors.title)}
                                    value={form.title}
                                    onChange={(event) =>
                                        updateField("title", event.target.value)
                                    }
                                />
                                {errors.title ? (
                                    <span className="cxw-error-text">{errors.title}</span>
                                ) : null}
                            </label>
                            <label className="cxw-label">
                                Organization *
                                <input
                                    aria-invalid={Boolean(errors.organization)}
                                    value={form.organization}
                                    onChange={(event) =>
                                        updateField("organization", event.target.value)
                                    }
                                />
                                {errors.organization ? (
                                    <span className="cxw-error-text">{errors.organization}</span>
                                ) : null}
                            </label>
                            <label className="cxw-label">
                                Category *
                                <select
                                    aria-invalid={Boolean(errors.category)}
                                    value={form.category}
                                    onChange={(event) =>
                                        updateField("category", event.target.value)
                                    }
                                >
                                    <option value="">Select category</option>
                                    {categories.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                                {errors.category ? (
                                    <span className="cxw-error-text">{errors.category}</span>
                                ) : null}
                            </label>
                            <label className="cxw-label">
                                Date *
                                <input
                                    type="date"
                                    aria-invalid={Boolean(errors.date)}
                                    value={form.date}
                                    onChange={(event) =>
                                        updateField("date", event.target.value)
                                    }
                                />
                                {errors.date ? (
                                    <span className="cxw-error-text">{errors.date}</span>
                                ) : null}
                            </label>
                        </div>
                    </div>

                    <div className="cxw-card" style={{ marginTop: 12 }}>
                        <h2 className="cxw-title">Additional information</h2>
                        <div className="cxw-grid-two" style={{ marginTop: 10 }}>
                            <label className="cxw-label" style={{ gridColumn: "1 / -1" }}>
                                Description
                                <textarea
                                    value={form.description}
                                    onChange={(event) =>
                                        updateField("description", event.target.value)
                                    }
                                />
                            </label>
                            <label className="cxw-label">
                                Role
                                <input
                                    value={form.role}
                                    onChange={(event) =>
                                        updateField("role", event.target.value)
                                    }
                                />
                            </label>
                            <label className="cxw-label">
                                Skills (comma separated)
                                <input
                                    value={form.skills}
                                    onChange={(event) =>
                                        updateField("skills", event.target.value)
                                    }
                                />
                            </label>
                        </div>
                    </div>

                    <div className="cxw-card" style={{ marginTop: 12 }}>
                        <h2 className="cxw-title">Supporting evidence</h2>
                        <label className="cxw-label" style={{ marginTop: 10 }}>
                            Optional evidence URL
                            <input
                                aria-invalid={Boolean(errors.evidenceUrl)}
                                value={form.evidenceUrl}
                                placeholder="https://example.com/evidence"
                                onChange={(event) =>
                                    updateField("evidenceUrl", event.target.value)
                                }
                            />
                        </label>
                        <div
                            className="cxw-file-drop"
                            onDrop={(event) => {
                                event.preventDefault()
                                chooseFile(event.dataTransfer.files?.[0] || null)
                            }}
                            onDragOver={(event) => event.preventDefault()}
                        >
                            <p style={{ margin: "0 0 6px", fontSize: 13 }}>
                                Drop file here or choose a file
                            </p>
                            <label className="cxw-link" style={{ cursor: "pointer" }}>
                                Choose file
                                <input
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={(event) =>
                                        chooseFile(event.target.files?.[0] || null)
                                    }
                                />
                            </label>
                            <p className="cxw-note">PDF, PNG, JPG up to 10MB</p>
                            {localFile ? (
                                <p className="cxw-note" aria-live="polite">
                                    {localFile.name} • {(localFile.size / (1024 * 1024)).toFixed(2)} MB • Local preparation {localProgress}% (not uploaded)
                                </p>
                            ) : null}
                            {previewUrl && localFile?.type === "application/pdf" ? (
                                <iframe
                                    title="Local PDF preview"
                                    src={previewUrl}
                                    className="cxw-file-preview-frame"
                                />
                            ) : previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Local evidence preview"
                                    className="cxw-file-preview"
                                />
                            ) : null}
                        </div>
                        {errors.evidence || errors.evidenceUrl ? (
                            <p className="cxw-error-text" role="alert">
                                {errors.evidence || errors.evidenceUrl}
                            </p>
                        ) : null}
                    </div>

                    {errors.storage || errors.record ? (
                        <p className="cxw-alert" role="alert" style={{ marginTop: 12 }}>
                            {errors.storage || errors.record}
                        </p>
                    ) : null}

                    <div
                        className="cxw-actions"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 14,
                        }}
                    >
                        <button
                            type="button"
                            className="cxw-btn cxw-btn-secondary"
                            onClick={() => submit("draft")}
                        >
                            Save draft
                        </button>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            <a
                                className="cxw-btn cxw-btn-secondary"
                                href={ACHIEVEMENTS_PATH}
                            >
                                Cancel
                            </a>
                            {!showReview ? (
                                <button
                                    type="button"
                                    className="cxw-btn"
                                    onClick={() => setShowReview(true)}
                                >
                                    Review submission
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="cxw-btn"
                                    onClick={() => submit("pending")}
                                >
                                    Confirm submission
                                </button>
                            )}
                        </div>
                    </div>

                    {showReview ? (
                        <div className="cxw-card cxw-review-panel">
                            <h2 className="cxw-title">Review summary</h2>
                            <p className="cxw-text" style={{ marginTop: 8 }}>
                                {form.title || "Untitled"} • {form.organization || "Unknown"} • {formatAchievementDate(form.date)}
                            </p>
                            <p className="cxw-text" style={{ marginTop: 4 }}>
                                Evidence: {localFile?.name || "No local file selected"}
                            </p>
                            <button
                                type="button"
                                className="cxw-btn cxw-btn-secondary"
                                style={{ marginTop: 12 }}
                                onClick={() => setShowReview(false)}
                            >
                                Edit details
                            </button>
                        </div>
                    ) : null}
                </>
            )}

            {success ? (
                <div className="cxw-card" style={{ marginTop: 12 }}>
                    <p style={{ display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
                        <AchievementStatus status={success.status} />
                        <span>
                            {success.status === "draft"
                                ? "Draft saved in this browser."
                                : "Submitted for verification in this prototype."}
                        </span>
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                        <a
                            className="cxw-link"
                            href={achievementDetailPath(success.id)}
                        >
                            Open detail
                        </a>
                        <a className="cxw-link" href={ACHIEVEMENTS_PATH}>
                            Back to Achievements
                        </a>
                    </div>
                </div>
            ) : null}
        </section>
    )
}

export default AchievementRecordEditor
