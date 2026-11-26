import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../services/AppContext";
import { EVENT_TYPES, EVENT_STATUSES } from "../../services/eventService";

export function EventModal() {
  const { t } = useTranslation();
  const { isEventModalOpen, setIsEventModalOpen, editingEvent, saveEvent } = useApp();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("workshop");
  const [status, setStatus] = useState("upcoming");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationType, setLocationType] = useState("in_person");
  const [location, setLocation] = useState("");
  const [onlineLink, setOnlineLink] = useState("");
  const [capacity, setCapacity] = useState(50);
  const [bannerUrl, setBannerUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title || "");
      setType(editingEvent.type || "workshop");
      setStatus(editingEvent.status || "upcoming");
      setStartDate(editingEvent.startDate || "");
      setEndDate(editingEvent.endDate || "");
      setLocationType(editingEvent.locationType || "in_person");
      setLocation(editingEvent.location || "");
      setOnlineLink(editingEvent.onlineLink || "");
      setCapacity(editingEvent.capacity || 50);
      setBannerUrl(editingEvent.bannerUrl || "");
      setDescription(editingEvent.description || "");
      setTags(editingEvent.tags ? editingEvent.tags.join(", ") : "");
    } else {
      setTitle("");
      setType("workshop");
      setStatus("upcoming");
      setStartDate("");
      setEndDate("");
      setLocationType("in_person");
      setLocation("Campus SESAME - Innovation Hall");
      setOnlineLink("");
      setCapacity(50);
      setBannerUrl("");
      setDescription("");
      setTags("");
    }
    setErrors({});
  }, [editingEvent, isEventModalOpen]);

  if (!isEventModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = t("requiredFields");
    if (!startDate) errs.startDate = t("requiredFields");
    if (endDate && new Date(endDate) < new Date(startDate)) {
      errs.endDate = t("records.modal.dateError");
    }
    if (locationType !== "online" && !location.trim()) {
      errs.location = t("requiredFields");
    }
    if (locationType !== "in_person" && !onlineLink.trim()) {
      errs.onlineLink = t("requiredFields");
    }
    if (capacity <= 0) errs.capacity = "Capacity > 0";
    if (!description.trim()) errs.description = t("requiredFields");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await saveEvent({
      title: title.trim(),
      type,
      status,
      startDate,
      endDate: endDate || startDate,
      locationType,
      location: locationType === "online" ? "" : location.trim(),
      onlineLink: locationType === "in_person" ? "" : onlineLink.trim(),
      capacity: Number(capacity),
      bannerUrl:
        bannerUrl.trim() ||
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border-light)",
    backgroundColor: "var(--surface)",
    color: "var(--text-main)",
    fontSize: "13.5px",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 70,
        padding: "20px",
      }}
    >
      <div className="cx-card" style={{ width: "100%", maxWidth: "600px", padding: "28px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "19px", fontWeight: "700", color: "var(--text-main)" }}>
              {editingEvent ? t("events.modal.editTitle") : t("events.modal.createTitle")}
            </h2>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{t("events.modal.subtitle")}</p>
          </div>
          <button
            onClick={() => setIsEventModalOpen(false)}
            style={{ background: "none", border: "none", fontSize: "20px", color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("events.modal.titleLabel")}
            </label>
            <input
              type="text"
              placeholder={t("events.modal.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ ...inputStyle, borderColor: errors.title ? "var(--badge-rejected-text)" : "var(--border-light)" }}
            />
            {errors.title && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.title}</span>}
          </div>

          <div className="cx-grid-2" style={{ gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.typeLabel")}
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                {EVENT_TYPES.filter((item) => item.value !== "all").map((item) => (
                  <option key={item.value} value={item.value}>
                    {t(item.labelKey)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.statusLabel")}
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                {EVENT_STATUSES.filter((item) => item.value !== "all").map((item) => (
                  <option key={item.value} value={item.value}>
                    {t(item.labelKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="cx-grid-2" style={{ gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.startLabel")}
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ ...inputStyle, borderColor: errors.startDate ? "var(--badge-rejected-text)" : "var(--border-light)" }}
              />
              {errors.startDate && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.startDate}</span>}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.endLabel")}
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ ...inputStyle, borderColor: errors.endDate ? "var(--badge-rejected-text)" : "var(--border-light)" }}
              />
              {errors.endDate && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.endDate}</span>}
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("events.modal.locationMode")}
            </label>
            <div style={{ display: "flex", gap: "14px", marginBottom: "10px", flexWrap: "wrap" }}>
              {[
                { id: "in_person", label: t("events.modal.inPerson") },
                { id: "online", label: t("events.modal.online") },
                { id: "hybrid", label: t("events.modal.hybrid") },
              ].map((m) => (
                <label key={m.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="locationType"
                    checked={locationType === m.id}
                    onChange={() => setLocationType(m.id)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  {m.label}
                </label>
              ))}
            </div>

            {locationType !== "online" && (
              <div style={{ marginBottom: "8px" }}>
                <input
                  type="text"
                  placeholder={t("events.modal.locationPlaceholder")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={inputStyle}
                />
                {errors.location && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.location}</span>}
              </div>
            )}

            {locationType !== "in_person" && (
              <div>
                <input
                  type="url"
                  placeholder={t("events.modal.linkPlaceholder")}
                  value={onlineLink}
                  onChange={(e) => setOnlineLink(e.target.value)}
                  style={inputStyle}
                />
                {errors.onlineLink && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.onlineLink}</span>}
              </div>
            )}
          </div>

          <div className="cx-grid-2" style={{ gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.capacityLabel")}
              </label>
              <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                {t("events.modal.bannerLabel")}
              </label>
              <input type="url" placeholder="https://images.unsplash.com/..." value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("events.modal.descLabel")}
            </label>
            <textarea
              rows={3}
              placeholder={t("events.modal.descPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
            {errors.description && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{errors.description}</span>}
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("events.modal.tagsLabel")}
            </label>
            <input type="text" placeholder="IA, Cloud, Design" value={tags} onChange={(e) => setTags(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsEventModalOpen(false)}
              style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid var(--border-light)", backgroundColor: "var(--surface)", color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "500" }}
            >
              {t("events.cancel")}
            </button>
            <button
              type="submit"
              style={{ padding: "10px 22px", borderRadius: "10px", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontSize: "13.5px", fontWeight: "600" }}
            >
              {editingEvent ? t("events.modal.saveBtn") : t("events.modal.createBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
