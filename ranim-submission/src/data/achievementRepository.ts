import { useSyncExternalStore } from "react"
import { MOCK_ACHIEVEMENTS } from "./mockAchievements"
import type {
    AchievementId,
    AchievementRecord,
    AchievementRepository,
    AchievementSaveResult,
    AchievementStatus,
} from "./achievementTypes"

export const ACHIEVEMENT_DEMO_STORAGE_KEY =
    "certix.achievements.mock.v1"

const isStatus = (value: unknown): value is AchievementStatus =>
    value === "verified" ||
    value === "pending" ||
    value === "rejected" ||
    value === "draft"

function isAchievementRecord(value: unknown): value is AchievementRecord {
    if (!value || typeof value !== "object") return false
    const item = value as Partial<AchievementRecord>
    return (
        typeof item.id === "string" &&
        item.type === "achievement" &&
        typeof item.title === "string" &&
        typeof item.category === "string" &&
        typeof item.organization === "string" &&
        typeof item.date === "string" &&
        typeof item.submittedAt === "string" &&
        isStatus(item.status) &&
        Array.isArray(item.statusHistory)
    )
}

let records = MOCK_ACHIEVEMENTS
let hydrated = false
const listeners = new Set<() => void>()

function hydrate(): void {
    if (hydrated) return
    hydrated = true
    if (typeof window === "undefined") return

    try {
        const raw = window.localStorage.getItem(ACHIEVEMENT_DEMO_STORAGE_KEY)
        if (!raw) return
        const parsed: unknown = JSON.parse(raw)
        if (Array.isArray(parsed)) records = parsed.filter(isAchievementRecord)
    } catch {
        // Keep the sample records if browser storage is unavailable or invalid.
    }
}

function notify(): void {
    listeners.forEach((listener) => listener())
}

function list(): AchievementRecord[] {
    hydrate()
    return records
}

function getById(id: AchievementId): AchievementRecord | undefined {
    return list().find((record) => record.id === id)
}

function save(record: AchievementRecord): AchievementSaveResult {
    hydrate()
    const previous = records
    const existingIndex = previous.findIndex((item) => item.id === record.id)
    records =
        existingIndex < 0
            ? [record, ...previous]
            : previous.map((item) => (item.id === record.id ? record : item))

    if (typeof window === "undefined") {
        notify()
        return { ok: true, persistence: "memory-only" }
    }

    try {
        window.localStorage.setItem(
            ACHIEVEMENT_DEMO_STORAGE_KEY,
            JSON.stringify(records)
        )
    } catch {
        records = previous
        return {
            ok: false,
            persistence: "browser-local",
            error: "Could not save this mock record in this browser.",
        }
    }

    notify()
    return { ok: true, persistence: "browser-local" }
}

function subscribe(listener: () => void): () => void {
    listeners.add(listener)
    if (typeof window === "undefined") {
        return () => listeners.delete(listener)
    }

    const onStorage = (event: StorageEvent): void => {
        if (event.key !== ACHIEVEMENT_DEMO_STORAGE_KEY) return
        hydrated = false
        hydrate()
        notify()
    }
    window.addEventListener("storage", onStorage)

    return () => {
        listeners.delete(listener)
        window.removeEventListener("storage", onStorage)
    }
}

export const mockAchievementRepository: AchievementRepository = {
    list,
    getById,
    save,
    subscribe,
}

export function useAchievementRecords(): AchievementRecord[] {
    return useSyncExternalStore(
        mockAchievementRepository.subscribe,
        mockAchievementRepository.list,
        () => MOCK_ACHIEVEMENTS
    )
}

export function nextAchievementId(current: AchievementRecord[]): AchievementId {
    const highest = current.reduce((max, record) => {
        const match = /^a(\d+)$/.exec(record.id)
        return match ? Math.max(max, Number(match[1])) : max
    }, 0)
    return "a" + String(highest + 1)
}
