import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language === "en" ? "en" : "fr";

  const switchLang = (lng) => {
    if (lng !== currentLang) {
      i18n.changeLanguage(lng);
    }
  };

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "2px",
        padding: "3px",
        borderRadius: "9999px",
        backgroundColor: "var(--surface-muted)",
        border: "1px solid var(--border-light)",
      }}
    >
      {!compact && (
        <span style={{ display: "inline-flex", alignItems: "center", paddingLeft: "6px", paddingRight: "2px", color: "var(--text-muted)" }}>
          <Globe size={13} />
        </span>
      )}
      <button
        type="button"
        onClick={() => switchLang("fr")}
        style={{
          padding: "4px 9px",
          borderRadius: "9999px",
          border: "none",
          fontSize: "11.5px",
          fontWeight: currentLang === "fr" ? "700" : "500",
          backgroundColor: currentLang === "fr" ? "var(--primary)" : "transparent",
          color: currentLang === "fr" ? "#ffffff" : "var(--text-muted)",
          transition: "0.15s ease",
        }}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => switchLang("en")}
        style={{
          padding: "4px 9px",
          borderRadius: "9999px",
          border: "none",
          fontSize: "11.5px",
          fontWeight: currentLang === "en" ? "700" : "500",
          backgroundColor: currentLang === "en" ? "var(--primary)" : "transparent",
          color: currentLang === "en" ? "#ffffff" : "var(--text-muted)",
          transition: "0.15s ease",
        }}
      >
        EN
      </button>
    </div>
  );
}
