import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { EventStatusBadge } from "../components/events/EventCard";
import { PARTICIPANT_ROLES, PARTICIPANT_STATUSES, EVENT_STATUSES } from "../services/eventService";
import {
  Calendar,
  MapPin,
  Globe,
  Users,
  Award,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  Edit2,
  AlertCircle,
  User,
} from "lucide-react";

export function EventDetailsPage() {
  const { t, i18n } = useTranslation();
  const {
    events,
    selectedEventId,
    setActiveTab,
    currentUser,
    openEditEventModal,
    deleteEvent,
    updateEventStatus,
    addParticipantToEvent,
    removeParticipantFromEvent,
    updateParticipantStatus,
    awardAchievementToParticipant,
  } = useApp();

  const event = events.find((e) => e.id === selectedEventId) || events[0];

  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [partName, setPartName] = useState("");
  const [partEmail, setPartEmail] = useState("");
  const [partRole, setPartRole] = useState("participant");
  const [partStatus, setPartStatus] = useState("confirmed");
  const [partError, setPartError] = useState("");
  const [profilePreview, setProfilePreview] = useState(null);

  if (!event) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>{t("events.emptyTitle")}</p>
        <button onClick={() => setActiveTab("events")}>{t("events.backToList")}</button>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";
  const participants = event.participants || [];

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    setPartError("");
    if (!partName.trim() || !partEmail.trim()) {
      setPartError(t("requiredFields"));
      return;
    }

    try {
      await addParticipantToEvent(event.id, {
        name: partName.trim(),
        email: partEmail.trim(),
        role: partRole,
        status: partStatus,
      });
      setIsAddingParticipant(false);
      setPartName("");
      setPartEmail("");
    } catch (err) {
      setPartError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-light)",
    backgroundColor: "var(--surface)",
    color: "var(--text-main)",
    fontSize: "13px",
    width: "100%",
  };

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <button
          onClick={() => setActiveTab("events")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={16} /> {t("events.backToList")}
        </button>

        {isAdmin && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => openEditEventModal(event)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              <Edit2 size={14} /> {t("events.editEvent")}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t("events.deleteConfirm", { title: event.title }))) {
                  deleteEvent(event.id);
                  setActiveTab("events");
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--badge-rejected-bg)",
                color: "var(--badge-rejected-text)",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <Trash2 size={14} /> {t("events.deleteEvent")}
            </button>
          </div>
        )}
      </div>

      {/* Main Event Card */}
      <div className="cx-card" style={{ overflow: "hidden", marginBottom: "28px" }}>
        <div style={{ height: "200px", position: "relative" }}>
          <img
            src={event.bannerUrl || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"}
            alt={event.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", top: "16px", right: "16px" }}>
            <EventStatusBadge status={event.status} />
          </div>
        </div>

        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                padding: "3px 10px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              {t(`events.types.${event.type}`, event.type)}
            </span>

            {isAdmin && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("events.lifecycle")}</span>
                <select
                  value={event.status}
                  onChange={(e) => updateEventStatus(event.id, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-light)",
                    fontSize: "12px",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-main)",
                  }}
                >
                  {EVENT_STATUSES.filter((s) => s.value !== "all").map((s) => (
                    <option key={s.value} value={s.value}>
                      {t(s.labelKey)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)", marginBottom: "14px" }}>
            {event.title}
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: "var(--surface-muted)",
              border: "1px solid var(--border-subtle)",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>
                <Calendar size={14} color="var(--primary)" /> {t("events.startDate")}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{formatDate(event.startDate)}</div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>
                <Calendar size={14} color="var(--primary)" /> {t("events.endDate")}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{formatDate(event.endDate)}</div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>
                {event.locationType === "online" ? <Globe size={14} color="#2563eb" /> : <MapPin size={14} color="#ea580c" />} {t("events.location")}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>
                {event.locationType === "online" ? t("events.onlineRoom") : event.location || "Campus SESAME"}
              </div>
              {event.onlineLink && (
                <a
                  href={event.onlineLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#2563eb", marginTop: "3px" }}
                >
                  {t("events.joinMeeting")} <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "3px" }}>
                <Users size={14} /> {t("events.capacity")}
              </div>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>
                {t("events.registeredCount", { count: participants.length, max: event.capacity || "∞" })}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              {t("events.aboutEvent")}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{event.description}</p>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "var(--surface-muted)",
                    color: "var(--text-secondary)",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: "500",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Participants Management Section */}
      <div className="cx-card" style={{ padding: "26px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
              {t("events.participantsTitle", { count: participants.length })}
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{t("events.participantsSubtitle")}</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddingParticipant(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <Plus size={15} /> {t("events.addParticipant")}
            </button>
          )}
        </div>

        {isAddingParticipant && (
          <form
            onSubmit={handleAddParticipant}
            style={{
              backgroundColor: "var(--surface-muted)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "18px",
              marginBottom: "20px",
            }}
          >
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-main)", marginBottom: "12px" }}>
              {t("events.registerStudentTitle")}
            </h4>

            {partError && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--badge-rejected-text)", fontSize: "12px", marginBottom: "10px" }}>
                <AlertCircle size={14} /> {partError}
              </div>
            )}

            <div className="cx-grid-filters" style={{ marginBottom: "12px" }}>
              <input
                type="text"
                placeholder={t("events.studentNamePlaceholder")}
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder={t("events.studentEmailPlaceholder")}
                value={partEmail}
                onChange={(e) => setPartEmail(e.target.value)}
                style={inputStyle}
              />
              <select value={partRole} onChange={(e) => setPartRole(e.target.value)} style={inputStyle}>
                {PARTICIPANT_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {t(r.labelKey)}
                  </option>
                ))}
              </select>
              <select value={partStatus} onChange={(e) => setPartStatus(e.target.value)} style={inputStyle}>
                {PARTICIPANT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t(s.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setIsAddingParticipant(false)}
                style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--surface)", color: "var(--text-secondary)", fontSize: "12.5px" }}
              >
                {t("events.cancel")}
              </button>
              <button
                type="submit"
                style={{ padding: "7px 16px", borderRadius: "8px", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontSize: "12.5px", fontWeight: "600" }}
              >
                {t("events.confirmAdd")}
              </button>
            </div>
          </form>
        )}

        {participants.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "13.5px" }}>
            {t("events.noParticipants")}
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "12px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--surface-muted)", borderBottom: "1px solid var(--border-light)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "12px 16px" }}>{t("events.table.student")}</th>
                  <th style={{ padding: "12px 16px" }}>{t("events.table.role")}</th>
                  <th style={{ padding: "12px 16px" }}>{t("events.table.status")}</th>
                  <th style={{ padding: "12px 16px" }}>{t("events.table.achievement")}</th>
                  {isAdmin && <th style={{ padding: "12px 16px", textAlign: "right" }}>{t("events.table.actions")}</th>}
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        onClick={() => {
                          if (p.userId === currentUser?.id) {
                            setActiveTab("public-preview");
                          } else if (isAdmin) {
                            setProfilePreview(p);
                          }
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isAdmin || p.userId === currentUser?.id ? "pointer" : "default" }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary-light)",
                            color: "var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--text-main)" }}>{p.name}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{p.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          backgroundColor: "var(--surface-muted)",
                          color: "var(--text-secondary)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "11.5px",
                          fontWeight: "500",
                        }}
                      >
                        {t(`events.roles.${p.role}`, p.role)}
                      </span>
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      {isAdmin ? (
                        <select
                          value={p.status}
                          onChange={(e) => updateParticipantStatus(event.id, p.id, e.target.value)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-light)",
                            backgroundColor: "var(--surface)",
                            color: "var(--text-main)",
                            fontSize: "12px",
                          }}
                        >
                          {PARTICIPANT_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {t(s.labelKey)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ color: "var(--badge-verified-text)", fontWeight: "500" }}>
                          {t(`events.participantStatuses.${p.status}`, p.status)}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "12px 16px" }}>
                      {p.achievementAwarded ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--badge-verified-text)", fontSize: "12px", fontWeight: "600" }}>
                          <CheckCircle size={14} /> {t("events.awardedVerified")}
                        </span>
                      ) : isAdmin ? (
                        <button
                          onClick={() => awardAchievementToParticipant(event, p)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            backgroundColor: "var(--badge-verified-bg)",
                            color: "var(--badge-verified-text)",
                            border: "1px solid var(--badge-verified-border)",
                            fontSize: "11.5px",
                            fontWeight: "600",
                          }}
                        >
                          <Award size={13} /> {t("events.awardBtn")}
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{t("events.pendingCompletion")}</span>
                      )}
                    </td>

                    {isAdmin && (
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => {
                            if (window.confirm(t("events.removeConfirm", { name: p.name }))) {
                              removeParticipantFromEvent(event.id, p.id);
                            }
                          }}
                          title={t("events.deleteEvent")}
                          style={{ background: "none", border: "none", color: "var(--badge-rejected-text)", padding: "4px" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Participant Profile Modal */}
      {profilePreview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 75,
            padding: "20px",
          }}
        >
          <div className="cx-card" style={{ maxWidth: "400px", width: "100%", padding: "24px", textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <User size={26} />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
              {profilePreview.name}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>{profilePreview.email}</p>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "18px" }}>
              {t("events.table.role")}: <strong>{t(`events.roles.${profilePreview.role}`, profilePreview.role)}</strong>
            </div>
            <button
              onClick={() => setProfilePreview(null)}
              style={{ padding: "8px 20px", borderRadius: "8px", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontWeight: "600" }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
