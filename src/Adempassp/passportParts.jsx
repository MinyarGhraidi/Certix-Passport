import { useTranslation } from "react-i18next";

// Catégories de la passport (event achievements, internships, certifications, projects)
export const CATEGORIES = [
  { value: "achievement", key: "catAchievement", label: "Event achievement" },
  { value: "internship", key: "catInternship", label: "Internship" },
  { value: "certification", key: "catCertification", label: "Certification" },
  { value: "project", key: "catProject", label: "Project" },
];

const STATUS = {
  verified: { key: "statusVerified", label: "Verified", color: "#059669", bg: "#d1fae5", icon: "✓" },
  pending: { key: "statusPending", label: "Pending", color: "#b45309", bg: "#fef3c7", icon: "…" },
  rejected: { key: "statusRejected", label: "Rejected", color: "#b91c1c", bg: "#fee2e2", icon: "✕" },
};

/* Badge de statut : texte + icône (pas seulement la couleur).
   Le statut vient TOUJOURS du backend : le frontend ne "vérifie" rien lui-même. */
export function StatusBadge({ status }) {
  const { t } = useTranslation();
  const s = STATUS[status] || STATUS.pending;
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "999px", fontSize: "13px", fontWeight: 600, color: s.color, background: s.bg }}>
      {s.icon} {t(s.key, s.label)}
    </span>
  );
}

export function useFormatDate() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("fr") ? "fr-FR" : "en-US";
  return (iso) =>
    iso ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`)) : "";
}

export function useCategoryLabel() {
  const { t } = useTranslation();
  return (value) => {
    const c = CATEGORIES.find((x) => x.value === value);
    return c ? t(c.key, c.label) : value;
  };
}
