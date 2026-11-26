import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../services/AppContext";
import { Calendar, MapPin, Globe, Users, Edit2, Trash2, ArrowRight } from "lucide-react";

export function EventStatusBadge({ status }) {
  const { t } = useTranslation();
  const styles = {
    upcoming: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    ongoing: { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
    completed: { bg: "#f1f5f9", text: "#475569", border: "#cbd5e1" },
    cancelled: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
    draft: { bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  };

  const current = styles[status] || styles.upcoming;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        backgroundColor: current.bg,
        color: current.text,
        border: `1px solid ${current.border}`,
        borderRadius: "9999px",
        padding: "3px 10px",
        fontSize: "11.5px",
        fontWeight: "600",
      }}
    >
      <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: current.text }} />
      {t(`events.statuses.${status}`, status)}
    </span>
  );
}

export function EventCard({ event }) {
  const { t, i18n } = useTranslation();
  const { currentUser, viewEventDetails, openEditEventModal, deleteEvent } = useApp();

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    return d.toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const participantCount = event.participants ? event.participants.length : 0;
  const isOrganizerOrAdmin = currentUser?.role === "admin";

  return (
    <div
      className="cx-card"
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ position: "relative", height: "140px", backgroundColor: "var(--primary-light)" }}>
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #b33753 0%, #7e2237 100%)" }} />
        )}
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <EventStatusBadge status={event.status} />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "12px",
            backgroundColor: "rgba(15, 23, 42, 0.78)",
            backdropFilter: "blur(4px)",
            color: "#ffffff",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {t(`events.types.${event.type}`, event.type)}
        </div>
      </div>

      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          onClick={() => viewEventDetails(event.id)}
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--text-main)",
            marginBottom: "8px",
            cursor: "pointer",
            lineHeight: "1.35",
          }}
        >
          {event.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "6px" }}>
          <Calendar size={14} color="var(--primary)" />
          <span>{formatDate(event.startDate)}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "12px" }}>
          {event.locationType === "online" ? (
            <>
              <Globe size={14} color="#2563eb" />
              <span>{t("events.onlineSession")}</span>
            </>
          ) : (
            <>
              <MapPin size={14} color="#ea580c" />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {event.location || "Campus SESAME"}
              </span>
            </>
          )}
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            marginBottom: "16px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {event.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
            fontSize: "12.5px",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Users size={14} />
            <span>
              {participantCount} {event.capacity ? `/ ${event.capacity}` : t("events.attendees")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isOrganizerOrAdmin && (
              <>
                <button
                  onClick={() => openEditEventModal(event)}
                  title={t("events.editEvent")}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", padding: "4px" }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t("events.deleteConfirm", { title: event.title }))) {
                      deleteEvent(event.id);
                    }
                  }}
                  title={t("events.deleteEvent")}
                  style={{ background: "none", border: "none", color: "var(--badge-rejected-text)", padding: "4px" }}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            <button
              onClick={() => viewEventDetails(event.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                color: "var(--primary)",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              {t("events.details")} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
