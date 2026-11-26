import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { Award, BookOpen, Briefcase, Calendar, ArrowRight, FolderPlus, Sparkles, HelpCircle } from "lucide-react";

export function DashboardPage() {
  const { t } = useTranslation();
  const { currentUser, records, setActiveTab } = useApp();

  const achievementsCount = records.filter((r) => r.category === "achievement" && r.status === "verified").length;
  const certificationsCount = records.filter((r) => r.category === "certification" && r.status === "verified").length;
  const experiencesCount = records.filter((r) => r.category === "experience" && r.status === "verified").length;
  const activitiesCount = records.filter((r) => r.category === "activity" && r.status === "verified").length;

  // Dynamic profile completion calculation
  const checks = [
    Boolean(currentUser?.firstName && currentUser?.lastName),
    Boolean(currentUser?.studyProgram),
    Boolean(currentUser?.level),
    Boolean(currentUser?.bio),
    Boolean(currentUser?.linkedin || currentUser?.github),
    Boolean(currentUser?.avatar),
  ];
  const completionPct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Banner Card with Passport Preview */}
      <div className="cx-grid-hero" style={{ marginBottom: "28px" }}>
        <div
          style={{
            backgroundColor: "var(--surface-muted)",
            borderRadius: "16px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            border: "1px solid var(--border-light)",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "6px" }}>
              {currentUser?.studyProgram || "Génie Logiciel"} · {currentUser?.university || "Université SESAME"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "18px" }}>
              <span style={{ color: "var(--badge-verified-text)", fontWeight: "700" }}>✓</span>{" "}
              {currentUser?.club || t("app.clubName")} · {t("dashboard.memberSince")}
            </div>
            <button
              onClick={() => setActiveTab("passport")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: "600",
                fontSize: "14px",
                padding: 0,
              }}
            >
              {t("dashboard.explorePassport")} <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              width: "145px",
              height: "185px",
              backgroundColor: "var(--primary)",
              borderRadius: "12px",
              boxShadow: "0 10px 20px rgba(179,55,83,0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px",
              color: "#ffffff",
              transform: "rotate(6deg)",
              flexShrink: 0,
            }}
          >
            <div style={{ alignSelf: "center", marginTop: "10px", opacity: 0.85 }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M2 16h.01" />
                <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
              </svg>
            </div>
            <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", textAlign: "center" }}>
              {t("dashboard.passportCardLabel")}
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div
          className="cx-card"
          style={{
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              border: "6px solid var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--primary)",
              flexShrink: 0,
            }}
          >
            {completionPct}%
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              {currentUser?.avatar
                ? t("dashboard.profileComplete", { percent: completionPct })
                : t("dashboard.completePhoto")}
            </div>
            <button
              onClick={() => setActiveTab("settings")}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: "600",
                fontSize: "13px",
                padding: 0,
              }}
            >
              {t("dashboard.completeProfile")}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="cx-grid-4" style={{ marginBottom: "36px" }}>
        {[
          { tab: "achievements", count: achievementsCount, title: t("dashboard.stats.achievements"), desc: t("dashboard.stats.achievementsDesc"), Icon: Award },
          { tab: "certifications", count: certificationsCount, title: t("dashboard.stats.certifications"), desc: t("dashboard.stats.certificationsDesc"), Icon: BookOpen },
          { tab: "experience", count: experiencesCount, title: t("dashboard.stats.experiences"), desc: t("dashboard.stats.experiencesDesc"), Icon: Briefcase },
          { tab: "activities", count: activitiesCount, title: t("dashboard.stats.activities"), desc: t("dashboard.stats.activitiesDesc"), Icon: Calendar },
        ].map(({ tab, count, title, desc, Icon }) => (
          <div
            key={tab}
            className="cx-card"
            onClick={() => setActiveTab(tab)}
            style={{ padding: "22px", cursor: "pointer", position: "relative" }}
          >
            <div style={{ position: "absolute", top: "20px", right: "20px", color: "var(--primary)" }}>
              <Icon size={20} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
              {count}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px" }}>
              {title}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Section: More ways to grow */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", marginBottom: "18px" }}>
          {t("dashboard.growTitle")}
        </h2>
        <div className="cx-grid-3">
          {[
            { tab: "projects", Icon: FolderPlus, title: t("dashboard.grow.projectsTitle"), desc: t("dashboard.grow.projectsDesc"), cta: t("dashboard.grow.projectsCta") },
            { tab: "badges", Icon: Sparkles, title: t("dashboard.grow.milestonesTitle"), desc: t("dashboard.grow.milestonesDesc"), cta: t("dashboard.grow.milestonesCta") },
            { tab: "help", Icon: HelpCircle, title: t("dashboard.grow.guidanceTitle"), desc: t("dashboard.grow.guidanceDesc"), cta: t("dashboard.grow.guidanceCta") },
          ].map(({ tab, Icon, title, desc, cta }) => (
            <div
              key={tab}
              className="cx-card"
              style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <div>
                <div style={{ color: "var(--primary)", marginBottom: "14px" }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.55", marginBottom: "20px" }}>
                  {desc}
                </p>
              </div>
              <button
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontWeight: "600",
                  fontSize: "13.5px",
                  padding: 0,
                }}
              >
                {cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
