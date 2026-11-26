import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { EventCard } from "../components/events/EventCard";
import { EVENT_TYPES, EVENT_STATUSES } from "../services/eventService";
import { Search, Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export function EventsListPage() {
  const { t } = useTranslation();
  const { events, currentUser, openCreateEventModal, isLoadingData } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredEvents = events
    .filter((evt) => {
      if (selectedType !== "all" && evt.type !== selectedType) return false;
      if (selectedStatus !== "all" && evt.status !== selectedStatus) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const inTitle = evt.title.toLowerCase().includes(query);
        const inDesc = evt.description && evt.description.toLowerCase().includes(query);
        const inLoc = evt.location && evt.location.toLowerCase().includes(query);
        const inTags = evt.tags && evt.tags.some((tag) => tag.toLowerCase().includes(query));
        return inTitle || inDesc || inLoc || inTags;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date_asc") return new Date(a.startDate) - new Date(b.startDate);
      if (sortBy === "date_desc") return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const canCreate = currentUser?.role === "admin";

  const selectStyle = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border-light)",
    fontSize: "13.5px",
    backgroundColor: "var(--surface)",
    color: "var(--text-main)",
    outline: "none",
  };

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
            {t("events.pageTitle")}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("events.pageSubtitle")}</p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateEventModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 2px 5px rgba(179,55,83,0.2)",
            }}
          >
            <Plus size={16} />
            {t("events.createEvent")}
          </button>
        )}
      </div>

      <div className="cx-grid-filters" style={{ marginBottom: "24px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>
            {t("events.search")}
          </label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={t("events.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{ ...selectStyle, paddingLeft: "38px" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>
            {t("events.type")}
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            style={selectStyle}
          >
            {EVENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>
            {t("events.status")}
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={selectStyle}
          >
            {EVENT_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>
            {t("events.sortBy")}
          </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="date_asc">{t("events.sortDateAsc")}</option>
            <option value="date_desc">{t("events.sortDateDesc")}</option>
            <option value="title">{t("events.sortTitle")}</option>
          </select>
        </div>
      </div>

      {isLoadingData ? (
        <div className="cx-grid-3" style={{ marginBottom: "32px" }}>
          {[1, 2, 3].map((k) => (
            <div key={k} className="cx-card" style={{ height: "320px", padding: "20px", opacity: 0.6 }} />
          ))}
        </div>
      ) : paginatedEvents.length === 0 ? (
        <div className="cx-card" style={{ padding: "50px 20px", textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Calendar size={22} />
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
            {t("events.emptyTitle")}
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "18px" }}>
            {t("events.emptyDesc")}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedStatus("all");
            }}
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
            {t("events.clearFilters")}
          </button>
        </div>
      ) : (
        <div className="cx-grid-3" style={{ marginBottom: "32px" }}>
          {paginatedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {t("events.showing", {
              from: (currentPage - 1) * itemsPerPage + 1,
              to: Math.min(currentPage * itemsPerPage, filteredEvents.length),
              total: filteredEvents.length,
            })}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                backgroundColor: "var(--surface)",
                color: currentPage === 1 ? "var(--text-muted)" : "var(--text-main)",
                fontSize: "13px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              <ChevronLeft size={16} /> {t("events.previous")}
            </button>

            <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)", padding: "0 8px" }}>
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                backgroundColor: "var(--surface)",
                color: currentPage === totalPages ? "var(--text-muted)" : "var(--text-main)",
                fontSize: "13px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              {t("events.next")} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
