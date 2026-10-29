export type AchievementId = string
export type RecordId = AchievementId

export type AchievementStatus =
    | "verified"
    | "pending"
    | "rejected"
    | "draft"

export type AchievementCategory =
    | "competition"
    | "recognition"
    | "academic"
    | "service"

export interface AchievementStatusHistoryItem {
    status: AchievementStatus
    at: string
    by: string
    note?: string
}

/**
 * Achievements are records in the current prototype model. This one id
 * identifies the card, detail route, editor route, and status history.
 */
export interface AchievementRecord {
    id: AchievementId
    type: "achievement"
    title: string
    category: AchievementCategory
    organization: string
    date: string
    role?: string
    description?: string
    skills?: string[]
    evidenceFileName?: string
    evidenceUrl?: string
    submittedAt: string
    status: AchievementStatus
    rejectionReason?: string
    statusHistory: AchievementStatusHistoryItem[]
}

export interface AchievementSaveResult {
    ok: boolean
    error?: string
    persistence: "browser-local" | "memory-only"
}

/** A small replaceable contract for the mock or a later production adapter. */
export interface AchievementRepository {
    list(): AchievementRecord[]
    getById(id: AchievementId): AchievementRecord | undefined
    save(record: AchievementRecord): AchievementSaveResult
    subscribe(listener: () => void): () => void
}
