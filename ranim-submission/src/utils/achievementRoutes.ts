import type { AchievementId } from "../data/achievementTypes"

export const ACHIEVEMENTS_PATH = "/achievements"

export function achievementDetailPath(id: AchievementId): string {
    return "/records/detail?type=achievement&record=" + encodeURIComponent(id)
}

export function newAchievementPath(): string {
    return "/records/new?type=achievement"
}

export function editAchievementPath(id: AchievementId): string {
    return "/records/edit?type=achievement&record=" + encodeURIComponent(id)
}

export function formatAchievementDate(value?: string): string {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}
