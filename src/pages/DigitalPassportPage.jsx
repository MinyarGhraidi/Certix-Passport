import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { StatusBadge } from "../components/ui/Badges";
import { Eye, EyeOff, Plus, AlertCircle, Share2, Filter, Edit3 } from "lucide-react";

export function DigitalPassportPage() {
  const { t } = useTranslation();
  const { currentUser, records, toggleVisibility, openAddModal, openEditModal, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const initials =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
      : "AM";

  const verifiedCount = records.filter((r) => r.status === "verified").length;
  const years = ["all", "2026", "2025", "2024"];

  const filteredRecords = records
    .filter((rec) => {
      if (filterType !== "all" && rec.category !== filterType) return false;
      if (filterYear !== "all" && !String(rec.date || "").startsWith(filterYear)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "980px", margin: "0 auto" }}>
      {/* Member Header Card */}
      <div
        className="cx-card"
        style={{
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "700",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initials
            )}
          </div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
              {currentUser?.fullName || "Amira Mansour"}
            </h1>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              {currentUser?.studyProgram || "Génie Logiciel"} · {currentUser?.level || "3ème année"}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {currentUser?.university || "Université SESAME"} · {currentUser?.club || t("app.clubName")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "var(--badge-verified-bg)",
              color: "var(--badge-verified-text)",
              padding: "6px 14px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: "600",
              border: "1px solid var(--badge-verified-border)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{t("passport.verifiedCount", { count: verifiedCount })}</span>
          </div>

          <button
            onClick={() => setActiveTab("public-preview")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--surface)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            <Share2 size={14} />
            {t("passport.share")}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["all", "achievement", "certification", "experience", "activity", "project"].map((cat) => {
            const isSelected = filterType === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                style={{
                  padding: "6px 15px",
                  borderRadius: "9999px",
                  border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                  backgroundColor: isSelected ? "var(--primary-light)" : "var(--surface)",
                  color: isSelected ? "var(--primary)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: isSelected ? "600" : "500",
                  transition: "0.15s ease",
                }}
              >
                {t(`categories.${cat}`)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("passport.year")}:</span>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              fontSize: "13px",
              backgroundColor: "var(--surface)",
              color: "var(--text-main)",
              outline: "none",
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y === "all" ? t("passport.allYears") : y}
              </option>
            ))}
          </select>

          <button
            onClick={() => openAddModal(filterType === "all" ? "achievement" : filterType)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: "600",
              marginLeft: "4px",
            }}
          >
            <Plus size={15} />
            {t("passport.addItem")}
          </button>
        </div>
      </div>

      {/* Timeline List */}
      {filteredRecords.length === 0 ? (
        <div className="cx-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Filter size={20} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
            {t("passport.emptyTitle")}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px" }}>
            {t("passport.emptyDesc")}
          </p>
          <button
            onClick={() => openAddModal(filterType === "all" ? "achievement" : filterType)}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {t("passport.emptyCta")}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {filteredRecords.map((item) => (
            <div key={item.id} className="cx-card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    {t(`categories.${item.category}`)} • {item.date} {item.role ? `• ${item.role}` : ""}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                    {item.organization}
                  </div>
                  {item.description && (
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5", maxWidth: "700px" }}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Right controls: Status Badge & Visibility toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {item.status !== "rejected" && (
                    <button
                      onClick={() => toggleVisibility(item.id)}
                      title={item.visible ? t("passport.toggleToPrivate") : t("passport.toggleToPublic")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        border: "1px solid var(--border-light)",
                        padding: "5px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: item.visible ? "var(--badge-verified-text)" : "var(--text-muted)",
                        backgroundColor: item.visible ? "var(--badge-verified-bg)" : "var(--surface)",
                      }}
                    >
                      {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span>{item.visible ? t("status.public") : t("status.private")}</span>
                    </button>
                  )}

                  <StatusBadge
                    status={item.status}
                    isClubOfficial={item.isClubOfficial}
                    showOfficialLabel={item.status === "verified"}
                  />

                  {item.status === "rejected" && (
                    <button
                      onClick={() => openEditModal(item)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 11px",
                        borderRadius: "8px",
                        backgroundColor: "var(--primary)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      <Edit3 size={13} />
                      {t("passport.resubmit")}
                    </button>
                  )}
                </div>
              </div>

              {item.status === "rejected" && item.rejectionReason && (
                <div
                  style={{
                    backgroundColor: "var(--badge-rejected-bg)",
                    border: "1px solid var(--badge-rejected-border)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12.5px",
                    color: "var(--badge-rejected-text)",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>
                    <strong>{t("passport.rejectionReason")}</strong> {item.rejectionReason}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
