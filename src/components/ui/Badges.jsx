import React from "react";
import { useTranslation } from "react-i18next";
import { Check, Clock, AlertCircle, ShieldCheck } from "lucide-react";

export function StatusBadge({ status, size = "md", isClubOfficial = false, showOfficialLabel = false }) {
  const { t } = useTranslation();

  if (status === "verified") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "var(--badge-verified-bg)",
          color: "var(--badge-verified-text)",
          padding: size === "sm" ? "3px 9px" : "4px 12px",
          borderRadius: "9999px",
          fontSize: size === "sm" ? "11.5px" : "12.5px",
          fontWeight: 600,
          border: "1px solid var(--badge-verified-border)",
          whiteSpace: "nowrap",
        }}
      >
        {showOfficialLabel && isClubOfficial ? (
          <ShieldCheck size={size === "sm" ? 12 : 14} strokeWidth={2.4} />
        ) : (
          <Check size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
        )}
        {showOfficialLabel
          ? isClubOfficial
            ? t("status.verified")
            : t("status.declared")
          : t("status.verifiedShort")}
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "var(--badge-pending-bg)",
          color: "var(--badge-pending-text)",
          padding: size === "sm" ? "3px 9px" : "4px 12px",
          borderRadius: "9999px",
          fontSize: size === "sm" ? "11.5px" : "12.5px",
          fontWeight: 600,
          border: "1px solid var(--badge-pending-border)",
          whiteSpace: "nowrap",
        }}
      >
        <Clock size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
        {t("status.pending")}
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          backgroundColor: "var(--badge-rejected-bg)",
          color: "var(--badge-rejected-text)",
          padding: size === "sm" ? "3px 9px" : "4px 12px",
          borderRadius: "9999px",
          fontSize: size === "sm" ? "11.5px" : "12.5px",
          fontWeight: 600,
          border: "1px solid var(--badge-rejected-border)",
          whiteSpace: "nowrap",
        }}
      >
        <AlertCircle size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
        {t("status.rejected")}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--surface-muted)",
        color: "var(--text-muted)",
        padding: "4px 10px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {t("status.draft")}
    </span>
  );
}

export function CategoryIcon({ category, size = 18 }) {
  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        backgroundColor: "var(--primary-light)",
        color: "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {category === "achievement" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )}
      {category === "certification" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )}
      {category === "experience" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )}
      {category === "activity" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      )}
      {category === "project" && (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      )}
    </div>
  );
}
