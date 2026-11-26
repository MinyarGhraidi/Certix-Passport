import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { Check, X, FileText, Upload } from "lucide-react";

export function AdminDashboardPage() {
  const { t } = useTranslation();
  const { records, events, adminValidateRecord, adminRejectRecord, showNotification } = useApp();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [targetEventId, setTargetEventId] = useState(events[0]?.id || "");
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null);

  const pendingItems = records.filter((r) => r.status === "pending");
  const verifiedCount = records.filter((r) => r.status === "verified").length;

  const handleConfirmReject = async (id) => {
    if (!rejectionReason.trim()) {
      showNotification(t("admin.rejectPlaceholder"), "error");
      return;
    }
    await adminRejectRecord(id, rejectionReason);
    setRejectingId(null);
    setRejectionReason("");
  };

  const handleCsvSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setCsvPreview([
        { email: "amira@university.tn", role: "Team Lead", status: "OK" },
        { email: "yassine@university.tn", role: "Participant", status: "OK" },
        { email: "unknown.user@other.com", role: "Participant", status: "Email inconnu" },
      ]);
    }
  };

  const handleConfirmImport = () => {
    showNotification(t("notifications.csvImported", { ok: 2, err: 1 }));
    setCsvFile(null);
    setCsvPreview(null);
  };

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
          {t("admin.title")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("admin.subtitle")}</p>
      </div>

      {/* KPI Cards */}
      <div className="cx-grid-4" style={{ marginBottom: "32px" }}>
        <div className="cx-card" style={{ padding: "20px" }}>
          <div style={{ color: "var(--badge-pending-text)", fontSize: "26px", fontWeight: "700" }}>{pendingItems.length}</div>
          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{t("admin.kpi.pending")}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("admin.kpi.pendingDesc")}</div>
        </div>

        <div className="cx-card" style={{ padding: "20px" }}>
          <div style={{ color: "var(--badge-verified-text)", fontSize: "26px", fontWeight: "700" }}>{verifiedCount}</div>
          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{t("admin.kpi.verified")}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("admin.kpi.verifiedDesc")}</div>
        </div>

        <div className="cx-card" style={{ padding: "20px" }}>
          <div style={{ color: "#2563eb", fontSize: "26px", fontWeight: "700" }}>{events.length}</div>
          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{t("admin.kpi.events")}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("admin.kpi.eventsDesc")}</div>
        </div>

        <div className="cx-card" style={{ padding: "20px" }}>
          <div style={{ color: "#7c3aed", fontSize: "26px", fontWeight: "700" }}>142</div>
          <div style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{t("admin.kpi.members")}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("admin.kpi.membersDesc")}</div>
        </div>
      </div>

      {/* Pending Validation Section */}
      <div className="cx-card" style={{ padding: "24px", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px" }}>
          {t("admin.pendingTitle", { count: pendingItems.length })}
        </h2>

        {pendingItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontSize: "13.5px" }}>
            {t("admin.noPending")}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pendingItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--primary)" }}>
                      {t(`categories.${item.category}`)}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      • {t("admin.submittedOn", { date: item.date })}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)" }}>{item.title}</h4>
                  <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {item.organization} — {item.role}
                  </div>
                  {item.evidenceName && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#2563eb", marginTop: "6px" }}>
                      <FileText size={14} /> {t("admin.evidence")} {item.evidenceName}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    onClick={() => adminValidateRecord(item.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      backgroundColor: "#059669",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    <Check size={14} /> {t("admin.validate")}
                  </button>

                  <button
                    onClick={() => setRejectingId(item.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    <X size={14} /> {t("admin.reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 75, padding: "20px" }}>
          <div className="cx-card" style={{ padding: "24px", maxWidth: "460px", width: "100%" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
              {t("admin.rejectModalTitle")}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px" }}>
              {t("admin.rejectModalDesc")}
            </p>
            <textarea
              rows={3}
              placeholder={t("admin.rejectPlaceholder")}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
                backgroundColor: "var(--surface)",
                color: "var(--text-main)",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setRejectingId(null)}
                style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--surface)", color: "var(--text-secondary)" }}
              >
                {t("events.cancel")}
              </button>
              <button
                onClick={() => handleConfirmReject(rejectingId)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "none", backgroundColor: "#dc2626", color: "#ffffff", fontWeight: "600" }}
              >
                {t("admin.confirmReject")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Section */}
      <div className="cx-card" style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
          {t("admin.csvTitle")}
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "16px" }}>
          {t("admin.csvDesc")}
        </p>

        <div style={{ marginBottom: "14px", maxWidth: "420px" }}>
          <label style={{ display: "block", fontSize: "12.5px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
            {t("admin.selectEvent")}
          </label>
          <select
            value={targetEventId}
            onChange={(e) => setTargetEventId(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--surface)",
              color: "var(--text-main)",
              fontSize: "13px",
            }}
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", flexWrap: "wrap" }}>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "8px",
              border: "1px dashed var(--border-light)",
              cursor: "pointer",
              backgroundColor: "var(--surface-muted)",
              color: "var(--text-main)",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            <Upload size={16} /> {t("admin.selectCsv")}
            <input type="file" accept=".csv" onChange={handleCsvSelect} style={{ display: "none" }} />
          </label>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {csvFile ? csvFile.name : t("admin.csvColumnsHint")}
          </span>
        </div>

        {csvPreview && (
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)", marginBottom: "8px" }}>
              {t("admin.previewTitle", { count: csvPreview.length })}
            </h4>
            <div style={{ border: "1px solid var(--border-light)", borderRadius: "8px", overflow: "hidden", marginBottom: "14px" }}>
              {csvPreview.map((row, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border-subtle)", fontSize: "13px" }}>
                  <span>
                    {row.email} — <strong>{row.role}</strong>
                  </span>
                  <span style={{ color: row.status === "OK" ? "var(--badge-verified-text)" : "var(--badge-pending-text)", fontWeight: "600" }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmImport}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "13.5px",
                fontWeight: "600",
              }}
            >
              {t("admin.confirmImport")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
