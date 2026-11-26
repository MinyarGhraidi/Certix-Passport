import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { StatusBadge, CategoryIcon } from "../components/ui/Badges";
import { Search, Plus, Eye, EyeOff, Upload, AlertCircle } from "lucide-react";

export function RecordsSectionPage({ category, title, addLabel }) {
  const { t } = useTranslation();
  const { records, openAddModal, openEditModal, toggleVisibility } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSubcat, setSelectedSubcat] = useState("all");
  const [sortBy, setSortBy] = useState("Newest");

  const categoryRecords = records.filter((r) => r.category === category);

  const statusCounts = {
    All: categoryRecords.length,
    Verified: categoryRecords.filter((r) => r.status === "verified").length,
    Pending: categoryRecords.filter((r) => r.status === "pending").length,
    Rejected: categoryRecords.filter((r) => r.status === "rejected").length,
    Draft: categoryRecords.filter((r) => r.status === "draft").length,
  };

  const statusMap = {
    All: t("records.statusTabs.all"),
    Verified: t("records.statusTabs.verified"),
    Pending: t("records.statusTabs.pending"),
    Rejected: t("records.statusTabs.rejected"),
    Draft: t("records.statusTabs.draft"),
  };

  const filtered = categoryRecords
    .filter((r) => {
      if (statusFilter !== "All" && r.status !== statusFilter.toLowerCase()) return false;
      if (selectedSubcat !== "all" && r.type !== selectedSubcat) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          r.title.toLowerCase().includes(query) ||
          r.organization.toLowerCase().includes(query) ||
          (r.description && r.description.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Newest") return new Date(b.date) - new Date(a.date);
      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Header & Add button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)" }}>
          {title}
        </h1>
        <button
          onClick={() => openAddModal(category)}
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
            boxShadow: "0 2px 4px rgba(179,55,83,0.2)",
          }}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cx-grid-filters-3" style={{ marginBottom: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
            {t("records.search")}
          </label>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder={t("records.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                borderRadius: "10px",
                border: "1px solid var(--border-light)",
                fontSize: "13.5px",
                outline: "none",
                backgroundColor: "var(--surface)",
                color: "var(--text-main)",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
            {t("records.category")}
          </label>
          <select
            value={selectedSubcat}
            onChange={(e) => setSelectedSubcat(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-light)",
              fontSize: "13.5px",
              outline: "none",
              backgroundColor: "var(--surface)",
              color: "var(--text-main)",
            }}
          >
            <option value="all">{t("records.allSubcats")}</option>
            <option value="competition">Competition</option>
            <option value="workshop">Workshop</option>
            <option value="recognition">Recognition</option>
            <option value="internship">Internship / Stage</option>
            <option value="technical">Technical</option>
            <option value="professional">Professional</option>
            <option value="open_source">Open Source</option>
            <option value="academic">Academic</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
            {t("records.sort")}
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border-light)",
              fontSize: "13.5px",
              outline: "none",
              backgroundColor: "var(--surface)",
              color: "var(--text-main)",
            }}
          >
            <option value="Newest">{t("records.newest")}</option>
            <option value="Oldest">{t("records.oldest")}</option>
          </select>
        </div>
      </div>

      {/* Status Pills */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["All", "Verified", "Pending", "Rejected", "Draft"].map((status) => {
          const isSelected = statusFilter === status;
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                backgroundColor: isSelected ? "var(--primary-light)" : "var(--surface)",
                color: isSelected ? "var(--primary)" : "var(--text-muted)",
                fontSize: "12.5px",
                fontWeight: isSelected ? "600" : "500",
              }}
            >
              {statusMap[status]} ({count})
            </button>
          );
        })}

        {(statusFilter !== "All" || searchTerm || selectedSubcat !== "all") && (
          <button
            onClick={() => {
              setStatusFilter("All");
              setSearchTerm("");
              setSelectedSubcat("all");
            }}
            style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12px", marginLeft: "6px" }}
          >
            {t("records.clearFilters")}
          </button>
        )}
      </div>

      {/* 3-Column Card Grid */}
      {filtered.length === 0 ? (
        <div className="cx-card" style={{ padding: "44px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>{t("records.empty")}</p>
          <button
            onClick={() => openAddModal(category)}
            style={{ padding: "9px 18px", borderRadius: "8px", backgroundColor: "var(--primary)", color: "#ffffff", border: "none", fontSize: "13px", fontWeight: "600" }}
          >
            {addLabel}
          </button>
        </div>
      ) : (
        <div className="cx-grid-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="cx-card"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CategoryIcon category={item.category} />
                    <span style={{ fontSize: "11.5px", color: "var(--text-muted)", textTransform: "lowercase", fontWeight: "500" }}>
                      {item.type || item.category}
                    </span>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px", lineHeight: "1.35" }}>
                  {item.title}
                </h3>

                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {item.organization}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                  {item.date} {item.role ? `• ${item.role}` : ""}
                </div>

                {item.category === "certification" && (
                  <div
                    style={{
                      border: "1px solid var(--badge-rejected-border)",
                      borderRadius: "10px",
                      padding: "10px",
                      backgroundColor: "var(--primary-light)",
                      marginBottom: "14px",
                    }}
                  >
                    <div style={{ fontSize: "9px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {t("records.certificateLabel")}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-main)" }}>
                      {item.organization}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{t("records.credentialVerified")}</div>
                  </div>
                )}

                {item.status === "rejected" && item.rejectionReason && (
                  <div
                    style={{
                      backgroundColor: "var(--badge-rejected-bg)",
                      border: "1px solid var(--badge-rejected-border)",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      fontSize: "11.5px",
                      color: "var(--badge-rejected-text)",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                    }}
                  >
                    <strong>{t("passport.rejectionReason")}</strong> {item.rejectionReason}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12.5px", fontWeight: "600", padding: 0 }}
                  >
                    {t("records.viewRecord")}
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "12.5px", padding: 0 }}
                  >
                    {t("records.edit")}
                  </button>
                </div>

                {item.status !== "rejected" && (
                  <button
                    onClick={() => toggleVisibility(item.id)}
                    title={item.visible ? t("status.public") : t("status.private")}
                    style={{ background: "none", border: "none", color: item.visible ? "var(--badge-verified-text)" : "var(--text-muted)", padding: 0 }}
                  >
                    {item.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RecordModal() {
  const { t } = useTranslation();
  const { isModalOpen, setIsModalOpen, editingRecord, modalInitialCategory, saveRecord } = useApp();

  const [category, setCategory] = useState(modalInitialCategory);
  const [type, setType] = useState("competition");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (editingRecord) {
      setCategory(editingRecord.category);
      setType(editingRecord.type || "competition");
      setTitle(editingRecord.title || "");
      setOrganization(editingRecord.organization || "");
      setStartDate(editingRecord.startDate || editingRecord.date || "");
      setEndDate(editingRecord.endDate || "");
      setDescription(editingRecord.description || "");
      setRole(editingRecord.role || "");
      setFile(editingRecord.evidenceName ? { name: editingRecord.evidenceName } : null);
    } else {
      setCategory(modalInitialCategory);
      setType("competition");
      setTitle("");
      setOrganization("");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setRole("");
      setFile(null);
    }
    setError("");
    setUploadProgress(0);
  }, [editingRecord, modalInitialCategory, isModalOpen]);

  if (!isModalOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError(t("records.modal.fileSizeError"));
      return;
    }

    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(selected.type)) {
      setError(t("records.modal.fileFormatError"));
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !organization.trim() || !startDate) {
      setError(t("records.modal.requiredError"));
      return;
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError(t("records.modal.dateError"));
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const rawFile = file instanceof File ? file : null;
      await saveRecord(
        {
          category,
          type,
          title: title.trim(),
          organization: organization.trim(),
          date: startDate,
          startDate,
          endDate: endDate || startDate,
          role: role.trim() || "Participant",
          description: description.trim(),
          evidenceName: file ? file.name : null,
          evidenceUrl: rawFile ? URL.createObjectURL(rawFile) : editingRecord?.evidenceUrl || null,
        },
        rawFile,
        (pct) => setUploadProgress(pct)
      );
    } catch (err) {
      setError(err.message || "Error submitting item.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
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
      <div
        className="cx-card"
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "28px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>
            {editingRecord
              ? editingRecord.status === "rejected"
                ? t("records.modal.resubmitTitle")
                : t("records.modal.editTitle")
              : t("records.modal.addTitle")}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            style={{ background: "none", border: "none", fontSize: "18px", color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>

        {editingRecord?.status === "verified" && (
          <div
            style={{
              backgroundColor: "var(--badge-pending-bg)",
              border: "1px solid var(--badge-pending-border)",
              borderRadius: "10px",
              padding: "10px 12px",
              marginBottom: "14px",
              fontSize: "12.5px",
              color: "var(--badge-pending-text)",
            }}
          >
            {t("records.modal.approvedRevalidationNotice")}
          </div>
        )}

        {editingRecord?.status === "rejected" && editingRecord.rejectionReason && (
          <div
            style={{
              backgroundColor: "var(--badge-rejected-bg)",
              border: "1px solid var(--badge-rejected-border)",
              borderRadius: "10px",
              padding: "12px",
              marginBottom: "16px",
              fontSize: "12.5px",
              color: "var(--badge-rejected-text)",
            }}
          >
            <strong>{t("records.modal.clubFeedback")}</strong>
            <p style={{ marginTop: "4px" }}>{editingRecord.rejectionReason}</p>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "var(--badge-rejected-bg)",
              color: "var(--badge-rejected-text)",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "12.5px",
              marginBottom: "16px",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="cx-grid-2" style={{ gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("records.modal.categoryLabel")}
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                <option value="achievement">{t("categories.achievement")}</option>
                <option value="certification">{t("categories.certification")}</option>
                <option value="experience">{t("categories.experience")}</option>
                <option value="activity">{t("categories.activity")}</option>
                <option value="project">{t("categories.project")}</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("records.modal.typeLabel")}
              </label>
              <input
                type="text"
                placeholder={t("records.modal.typePlaceholder")}
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("records.modal.titleLabel")}
            </label>
            <input
              type="text"
              required
              placeholder={t("records.modal.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("records.modal.orgLabel")}
            </label>
            <input
              type="text"
              required
              placeholder={t("records.modal.orgPlaceholder")}
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div className="cx-grid-2" style={{ gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("records.modal.startDateLabel")}
              </label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("records.modal.endDateLabel")}
              </label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("records.modal.roleLabel")}
            </label>
            <input
              type="text"
              placeholder={t("records.modal.rolePlaceholder")}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("records.modal.descLabel")}
            </label>
            <textarea
              rows={3}
              placeholder={t("records.modal.descPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("records.modal.evidenceLabel")}
            </label>
            <div
              style={{
                border: "2px dashed var(--border-light)",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                backgroundColor: "var(--surface-muted)",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <input
                type="file"
                accept=".pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}
              />
              <Upload size={22} color="var(--primary)" style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-main)" }}>
                {file ? file.name : t("records.modal.evidenceUpload")}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>
                {t("records.modal.evidenceHint")}
              </div>
            </div>
            {uploadProgress > 0 && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ height: "4px", backgroundColor: "var(--border-light)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${uploadProgress}%`, height: "100%", backgroundColor: "var(--primary)", transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {t("records.modal.uploading", { percent: uploadProgress })}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: "10px 18px", borderRadius: "8px", border: "1px solid var(--border-light)", backgroundColor: "var(--surface)", color: "var(--text-secondary)", fontSize: "13.5px", fontWeight: "500" }}
            >
              {t("records.modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: "10px 22px", borderRadius: "8px", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontSize: "13.5px", fontWeight: "600" }}
            >
              {submitting
                ? t("records.modal.submitting")
                : editingRecord
                  ? t("records.modal.resubmitBtn")
                  : t("records.modal.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
