import type { AchievementRecord } from "./achievementTypes"

const iso = (day: string): string => day + "T10:00:00.000Z"

export const MOCK_ACHIEVEMENTS: AchievementRecord[] = [
    {
        id: "a1",
        type: "achievement",
        title: "National Innovation Challenge — 1st Place",
        category: "competition",
        organization: "Enactus Tunisia",
        date: "2026-10-14",
        role: "Team Lead",
        description:
            "Led a 4-person student team presenting a sustainability-focused mobile concept.",
        skills: ["Leadership", "Pitching", "Innovation"],
        evidenceFileName: "innovation-challenge-certificate.pdf",
        submittedAt: iso("2026-10-15"),
        status: "verified",
        statusHistory: [
            { status: "pending", at: iso("2026-10-15"), by: "Amira Mansour" },
            {
                status: "verified",
                at: iso("2026-10-17"),
                by: "Youssef Ben Ali",
                note: "Cross-checked with official competition list.",
            },
        ],
    },
    {
        id: "a2",
        type: "achievement",
        title: "Outstanding Club Contributor",
        category: "recognition",
        organization: "Innovate Club",
        date: "2026-10-03",
        description:
            "Recognized for year-long volunteer contribution to mentorship events.",
        evidenceFileName: "club-contributor-letter.pdf",
        submittedAt: iso("2026-10-04"),
        status: "verified",
        statusHistory: [
            { status: "pending", at: iso("2026-10-04"), by: "Amira Mansour" },
            {
                status: "verified",
                at: iso("2026-10-05"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a3",
        type: "achievement",
        title: "Smart Campus Hackathon — 2nd Place",
        category: "competition",
        organization: "University of Carthage",
        date: "2026-06-12",
        evidenceFileName: "smart-campus-result.png",
        submittedAt: iso("2026-06-13"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2026-06-15"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a4",
        type: "achievement",
        title: "Student Mentor Appreciation Award",
        category: "recognition",
        organization: "CS Department Council",
        date: "2026-05-19",
        evidenceFileName: "mentor-award.pdf",
        submittedAt: iso("2026-05-20"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2026-05-23"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a5",
        type: "achievement",
        title: "AI for Good Ideathon Finalist",
        category: "competition",
        organization: "Tech4Impact MENA",
        date: "2026-03-03",
        evidenceFileName: "ideathon-finalist.png",
        submittedAt: iso("2026-03-04"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2026-03-06"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a6",
        type: "achievement",
        title: "Community Builder Badge",
        category: "recognition",
        organization: "Google Developer Student Club",
        date: "2025-12-02",
        evidenceFileName: "community-builder-badge.pdf",
        submittedAt: iso("2025-12-03"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2025-12-05"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a7",
        type: "achievement",
        title: "Research Poster Honorable Mention",
        category: "academic",
        organization: "Carthage Research Day",
        date: "2025-11-11",
        evidenceFileName: "poster-honorable-mention.pdf",
        submittedAt: iso("2025-11-12"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2025-11-13"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a8",
        type: "achievement",
        title: "Volunteer Impact Recognition",
        category: "service",
        organization: "Youth for Tunisia",
        date: "2025-10-05",
        evidenceFileName: "volunteer-impact-recognition.jpg",
        submittedAt: iso("2025-10-06"),
        status: "verified",
        statusHistory: [
            {
                status: "verified",
                at: iso("2025-10-08"),
                by: "Youssef Ben Ali",
            },
        ],
    },
    {
        id: "a9",
        type: "achievement",
        title: "Social Impact Challenge — Finalist",
        category: "competition",
        organization: "Social Ventures Forum",
        date: "2026-10-09",
        evidenceFileName: "social-impact-finalist.pdf",
        submittedAt: iso("2026-10-10"),
        status: "pending",
        statusHistory: [
            {
                status: "pending",
                at: iso("2026-10-10"),
                by: "Amira Mansour",
            },
        ],
    },
    {
        id: "a10",
        type: "achievement",
        title: "Campus Sustainability Pitch — Shortlisted",
        category: "competition",
        organization: "University of Carthage",
        date: "2025-09-18",
        description:
            "Shortlisted for a campus sustainability proposal; the sample record needs clearer dated evidence.",
        evidenceFileName: "sustainability-pitch.png",
        submittedAt: iso("2025-09-19"),
        status: "rejected",
        rejectionReason:
            "Please attach evidence that shows your name and the event date.",
        statusHistory: [
            { status: "pending", at: iso("2025-09-19"), by: "Amira Mansour" },
            {
                status: "rejected",
                at: iso("2025-09-22"),
                by: "Youssef Ben Ali",
                note: "Please attach evidence that shows your name and the event date.",
            },
        ],
    },
    {
        id: "a11",
        type: "achievement",
        title: "Peer Learning Workshop Recognition",
        category: "service",
        organization: "Innovate Club",
        date: "2025-08-11",
        description:
            "Draft example for demonstrating an unfinished achievement submission.",
        submittedAt: iso("2025-08-12"),
        status: "draft",
        statusHistory: [
            {
                status: "draft",
                at: iso("2025-08-12"),
                by: "Amira Mansour",
                note: "Saved locally as a draft.",
            },
        ],
    },
]
