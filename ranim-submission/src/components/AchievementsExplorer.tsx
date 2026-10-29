import * as React from "react"
import { AchievementStatus } from "./AchievementStatus"
import { useAchievementRecords } from "../data/achievementRepository"
import type { AchievementStatus as AchievementStatusValue } from "../data/achievementTypes"
import {
    achievementDetailPath,
    editAchievementPath,
    formatAchievementDate,
    newAchievementPath,
} from "../utils/achievementRoutes"
import "./AchievementStyles.css"

export type AchievementsPreviewState =
    | "default"
    | "empty"
    | "loading"
    | "error"

export interface AchievementsExplorerProps {
    previewState?: AchievementsPreviewState
    showAddAction?: boolean
    style?: React.CSSProperties
}

type StatusFilter = "all" | AchievementStatusValue
type SortOrder = "newest" | "oldest"

const statusFilters: StatusFilter[] = [
    "all",
    "verified",
    "pending",
    "rejected",
    "draft",
]

function filterLabel(status: StatusFilter): string {
    if (status === "all") return "All"
    if (status === "pending") return "Pending verification"
    return status[0].toUpperCase() + status.slice(1)
}

export function AchievementsExplorer({
    previewState = "default",
    showAddAction = true,
    style,
}: AchievementsExplorerProps): React.ReactElement {
    const allRecords = useAchievementRecords()
    const [search, setSearch] = React.useState("")
    const [category, setCategory] = React.useState("all")
    const [status, setStatus] = React.useState<StatusFilter>("all")
    const [sort, setSort] = React.useState<SortOrder>("newest")
    const [preview, setPreview] =
        React.useState<AchievementsPreviewState>(previewState)

    React.useEffect(() => {
        setPreview(previewState)
    }, [previewState])

    const counts = React.useMemo(() => {
        const value: Record<StatusFilter, number> = {
            all: allRecords.length,
            verified: 0,
            pending: 0,
            rejected: 0,
            draft: 0,
        }
        allRecords.forEach((record) => {
            value[record.status] += 1
        })
        return value
    }, [allRecords])

    const categories = React.useMemo(
        () => [
            "all",
            ...Array.from(new Set(allRecords.map((item) => item.category))),
        ],
        [allRecords]
    )

    const visibleRecords = React.useMemo(() => {
        let rows = allRecords
        if (preview === "empty") return []
        if (status !== "all") rows = rows.filter((item) => item.status === status)
        if (category !== "all")
            rows = rows.filter((item) => item.category === category)
        if (search.trim()) {
            const query = search.trim().toLowerCase()
            rows = rows.filter((item) =>
                (item.title + " " + item.organization + " " + item.category)
                    .toLowerCase()
                    .includes(query)
            )
        }
        return [...rows].sort((a, b) =>
            sort === "newest"
                ? b.date.localeCompare(a.date)
                : a.date.localeCompare(b.date)
        )
    }, [allRecords, category, preview, search, sort, status])

    const openRecord = (id: string): void => {
        window.location.assign(achievementDetailPath(id))
    }

    return (
        <section
            className="cxw cxw-achievements"
            style={style}
            aria-label="Achievements"
        >
            <div
                className="cxw-page-heading"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                }}
            >
                <h1 className="cxw-achievements-page-title">
                    Achievement records
                </h1>
                {showAddAction ? (
                    <a className="cxw-btn" href={newAchievementPath()}>
                        <span aria-hidden="true">+</span>
                        Add achievement
                    </a>
                ) : null}
            </div>

            <div className="cxw-toolbar" style={{ marginTop: 14 }}>
                <label className="cxw-label">
                    Search
                    <span className="cxw-search-wrap">
                        <input
                            type="search"
                            value={search}
                            placeholder="Search achievements..."
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </span>
                </label>
                <label className="cxw-label">
                    Category
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item === "all" ? "All categories" : item}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="cxw-label">
                    Sort
                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value as SortOrder)
                        }
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </label>
            </div>

            <div className="cxw-tabs" style={{ marginTop: 12 }}>
                {statusFilters.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={"cxw-tab" + (status === item ? " active" : "")}
                        aria-pressed={status === item}
                        onClick={() => setStatus(item)}
                    >
                        {filterLabel(item)} <span>({counts[item]})</span>
                    </button>
                ))}
                <button
                    type="button"
                    className="cxw-tab"
                    onClick={() => {
                        setSearch("")
                        setCategory("all")
                        setStatus("all")
                        setSort("newest")
                    }}
                >
                    Clear filters
                </button>
            </div>

            {preview === "loading" ? (
                <div style={{ marginTop: 14 }} aria-live="polite" aria-busy="true">
                    <p className="cxw-note">Loading achievements…</p>
                    <div className="cxw-cards" aria-hidden="true">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="cxw-card cxw-skeleton"
                            />
                        ))}
                    </div>
                </div>
            ) : preview === "error" ? (
                <div className="cxw-card" role="alert" style={{ marginTop: 14 }}>
                    <p className="cxw-title">
                        Achievements could not be loaded.
                    </p>
                    <p className="cxw-text" style={{ marginTop: 6 }}>
                        Try again to return to the local demonstration records.
                    </p>
                    <button
                        type="button"
                        className="cxw-btn cxw-btn-secondary"
                        style={{ marginTop: 12 }}
                        onClick={() => setPreview("default")}
                    >
                        Retry
                    </button>
                </div>
            ) : visibleRecords.length === 0 ? (
                <div className="cxw-card" style={{ marginTop: 14 }}>
                    <p className="cxw-title">No results for these filters.</p>
                    <p className="cxw-text" style={{ marginTop: 6 }}>
                        Clear the filters or add an achievement record.
                    </p>
                    <a className="cxw-link" href={newAchievementPath()}>
                        Add achievement
                    </a>
                </div>
            ) : (
                <div className="cxw-cards" style={{ marginTop: 14 }}>
                    {visibleRecords.map((record) => (
                        <article
                            key={record.id}
                            className="cxw-card"
                            style={{
                                minHeight: 235,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                cursor: "pointer",
                            }}
                            aria-label={"Open achievement: " + record.title}
                            onClick={(event) => {
                                const target = event.target as HTMLElement
                                if (target.closest("a, button, input, select")) return
                                openRecord(record.id)
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 10,
                                }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <p
                                        className="cxw-text"
                                        style={{
                                            marginBottom: 4,
                                            fontSize: 11,
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {record.category}
                                    </p>
                                    <h2 className="cxw-title">
                                        <a
                                            className="cxw-card-title-link"
                                            href={achievementDetailPath(record.id)}
                                        >
                                            {record.title}
                                        </a>
                                    </h2>
                                </div>
                                <AchievementStatus status={record.status} />
                            </div>
                            <p className="cxw-text">{record.organization}</p>
                            <p className="cxw-text">
                                {formatAchievementDate(record.date)}
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 12,
                                    marginTop: "auto",
                                    paddingTop: 10,
                                    borderTop: "1px solid var(--ach-border)",
                                }}
                            >
                                <a
                                    className="cxw-link"
                                    href={achievementDetailPath(record.id)}
                                >
                                    View record
                                </a>
                                {record.status !== "verified" ? (
                                    <a
                                        className="cxw-link"
                                        href={editAchievementPath(record.id)}
                                    >
                                        {record.status === "rejected"
                                            ? "Edit / Resubmit"
                                            : "Edit"}
                                    </a>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 12,
                }}
            >
                <p className="cxw-note">
                    Showing {visibleRecords.length} achievement records
                </p>
                <label className="cxw-label" style={{ width: 170 }}>
                    Preview state
                    <select
                        value={preview}
                        onChange={(event) =>
                            setPreview(
                                event.target.value as AchievementsPreviewState
                            )
                        }
                    >
                        <option value="default">Default</option>
                        <option value="empty">Empty</option>
                        <option value="loading">Loading</option>
                        <option value="error">Error</option>
                    </select>
                </label>
            </div>
        </section>
    )
}

export default AchievementsExplorer
