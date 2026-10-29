import * as React from "react"
import type { AchievementStatus as AchievementStatusValue } from "../data/achievementTypes"

const statusDetails: Record<
    AchievementStatusValue,
    { label: string; color: string }
> = {
    verified: {
        label: "Verified",
        color: "var(--ach-verified, #0E6A4E)",
    },
    pending: {
        label: "Pending verification",
        color: "var(--ach-pending, #8A5D10)",
    },
    rejected: {
        label: "Rejected",
        color: "var(--ach-rejected, #B33955)",
    },
    draft: {
        label: "Draft",
        color: "var(--ach-neutral, #68738B)",
    },
}

export function getAchievementStatusLabel(
    status: AchievementStatusValue
): string {
    return statusDetails[status].label
}

export function AchievementStatus({
    status,
}: {
    status: AchievementStatusValue
}): React.ReactElement {
    const detail = statusDetails[status]
    return (
        <span
            className="cxw-status cxw-achievement-status"
            style={{ color: detail.color }}
            aria-label={"Status: " + detail.label}
        >
            <span
                className="cxw-status-dot"
                aria-hidden="true"
                style={{ backgroundColor: detail.color }}
            />
            {detail.label}
        </span>
    )
}
