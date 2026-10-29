import * as React from "react"
import { AchievementStatus } from "./AchievementStatus"
import { useAchievementRecords } from "../data/achievementRepository"
import type { AchievementId } from "../data/achievementTypes"
import {
    ACHIEVEMENTS_PATH,
    editAchievementPath,
    formatAchievementDate,
} from "../utils/achievementRoutes"
import "./AchievementStyles.css"

export interface AchievementRecordDetailProps {
    recordId?: AchievementId
    style?: React.CSSProperties
}

function queryRecordId(): string {
    if (typeof window === "undefined") return ""
    return new URLSearchParams(window.location.search).get("record") || ""
}

export function AchievementRecordDetail({
    recordId,
    style,
}: AchievementRecordDetailProps): React.ReactElement {
    const records = useAchievementRecords()
    const id = recordId || queryRecordId()
    const record = records.find((item) => item.id === id)

    if (!record) {
        return (
            <section className="cxw cxw-achievements" style={style}>
                <div className="cxw-card">
                    <h1 className="cxw-title">We couldn’t find this record.</h1>
                    <p className="cxw-text" style={{ marginTop: 6 }}>
                        It may have been removed from the local demonstration data.
                    </p>
                    <a className="cxw-link" href={ACHIEVEMENTS_PATH}>
                        Back to Achievements
                    </a>
                </div>
            </section>
        )
    }

    const canEdit = record.status !== "verified"

    return (
        <section
            className="cxw cxw-achievements"
            style={style}
            aria-label="Achievement record detail"
        >
            <div className="cxw-detail">
                <article className="cxw-card">
                    <p
                        className="cxw-text"
                        style={{ marginBottom: 4, textTransform: "capitalize" }}
                    >
                        Achievement • {record.category}
                    </p>
                    <h1 className="cxw-achievements-record-title">
                        {record.title}
                    </h1>
                    <p className="cxw-text" style={{ marginTop: 6 }}>
                        {record.organization} • {formatAchievementDate(record.date)}
                    </p>
                    <div style={{ marginTop: 10 }}>
                        <AchievementStatus status={record.status} />
                    </div>

                    <div
                        className="cxw-card"
                        style={{
                            marginTop: 16,
                            padding: 16,
                            borderRadius: 12,
                            boxShadow: "none",
                            background: "var(--ach-soft)",
                        }}
                    >
                        <p
                            className="cxw-note"
                            style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
                        >
                            Supporting evidence
                        </p>
                        <div
                            style={{
                                marginTop: 10,
                                padding: 12,
                                border: "1px solid var(--ach-border)",
                                borderRadius: 10,
                                background: "var(--ach-surface)",
                            }}
                        >
                            <strong style={{ fontSize: 13 }}>
                                {record.evidenceFileName || "Evidence attachment"}
                            </strong>
                            <p className="cxw-text" style={{ marginTop: 4 }}>
                                Sample evidence display. No file is stored or uploaded by this frontend contribution.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                        <p className="cxw-text">
                            Description: {record.description || "No description provided."}
                        </p>
                        {record.role ? (
                            <p className="cxw-text">Role: {record.role}</p>
                        ) : null}
                        {record.skills?.length ? (
                            <p className="cxw-text">
                                Skills: {record.skills.join(", ")}
                            </p>
                        ) : null}
                        {record.evidenceUrl ? (
                            <p className="cxw-text">
                                Evidence link: {record.evidenceUrl}
                            </p>
                        ) : null}
                        <p className="cxw-text">
                            Submitted: {formatAchievementDate(record.submittedAt)}
                        </p>
                    </div>

                    {record.rejectionReason ? (
                        <div className="cxw-alert" style={{ marginTop: 12 }}>
                            <strong>Feedback:</strong> {record.rejectionReason}
                        </div>
                    ) : null}

                    <div
                        className="cxw-actions"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                            marginTop: 16,
                        }}
                    >
                        {canEdit ? (
                            <a
                                className="cxw-btn"
                                href={editAchievementPath(record.id)}
                            >
                                {record.status === "rejected"
                                    ? "Edit / Resubmit"
                                    : "Edit record"}
                            </a>
                        ) : null}
                        <a
                            className="cxw-btn cxw-btn-secondary"
                            href={ACHIEVEMENTS_PATH}
                        >
                            Back to Achievements
                        </a>
                    </div>
                </article>

                <aside className="cxw-card">
                    <h2 className="cxw-title">Status history</h2>
                    <ol className="cxw-status-history">
                        {record.statusHistory.map((entry, index) => (
                            <li key={record.id + "-" + index}>
                                <AchievementStatus status={entry.status} />
                                <span>
                                    {" "}• {new Date(entry.at).toLocaleString()} • {entry.by}
                                </span>
                                {entry.note ? (
                                    <p className="cxw-text" style={{ marginTop: 4 }}>
                                        {entry.note}
                                    </p>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>
        </section>
    )
}

export default AchievementRecordDetail
