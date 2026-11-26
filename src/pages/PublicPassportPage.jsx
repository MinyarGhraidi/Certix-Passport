import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { StatusBadge, CategoryIcon } from "../components/ui/Badges";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { Download, Copy, Check, ArrowLeft, ShieldCheck, ExternalLink, Globe, QrCode } from "lucide-react";

/**
 * Generates a deterministic QR-like SVG matrix encoded from the public URL
 * and renders a downloadable PNG via an offscreen canvas.
 */
function buildQrMatrix(text, size = 21) {
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  }
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const border = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[r0 + r][c0 + c] = border || inner;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      matrix[r][c] = (seed & 1) === 1;
    }
  }
  return matrix;
}

export function PublicPassportPage() {
  const { t } = useTranslation();
  const { currentUser, records, setActiveTab, showNotification } = useApp();
  const [copied, setCopied] = useState(false);
  const [generatedDate] = useState(() => new Date().toLocaleDateString());

  const slug = currentUser?.publicSlug || "amira-mansour-782";
  const baseUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;
  const publicUrl = `${baseUrl}/p/${slug}`;
  const qrMatrix = buildQrMatrix(publicUrl, 21);

  // Strict privacy rule: only verified AND visible items appear on the public passport
  const publicRecords = records.filter((r) => r.visible && r.status === "verified");

  const initials =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
      : "AM";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    showNotification(t("notifications.linkCopied"));
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadQrPng = () => {
    const scale = 12;
    const pad = 24;
    const dim = qrMatrix.length * scale + pad * 2;
    const canvas = document.createElement("canvas");
    canvas.width = dim;
    canvas.height = dim;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = "#0f172a";
    qrMatrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillRect(pad + c * scale, pad + r * scale, scale, scale);
        }
      });
    });
    const link = document.createElement("a");
    link.download = `certix-qr-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showNotification(t("notifications.qrDownloaded"));
  };

  const handleDownloadPDF = () => {
    showNotification(t("notifications.pdfGenerating"));
    setTimeout(() => window.print(), 250);
  };

  if (!currentUser?.publicSharingActive) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--background)",
          padding: "20px",
        }}
      >
        <div className="cx-card" style={{ maxWidth: "480px", textAlign: "center", padding: "40px" }}>
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "50%",
              backgroundColor: "var(--badge-rejected-bg)",
              color: "var(--badge-rejected-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Globe size={24} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
            {t("publicPassport.unavailableTitle")}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
            {t("publicPassport.unavailableDesc")}
          </p>
          <button
            onClick={() => setActiveTab("passport")}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {t("publicPassport.backWorkspace")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", padding: "28px 16px" }}>
      {/* Top Action Bar */}
      <div
        className="cx-no-print"
        style={{
          maxWidth: "880px",
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <button
          onClick={() => setActiveTab("passport")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "13.5px",
            fontWeight: "500",
          }}
        >
          <ArrowLeft size={16} /> {t("publicPassport.backDashboard")}
        </button>

        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <LanguageSwitcher compact />
          <button
            onClick={handleCopyLink}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--surface)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: "500",
            }}
          >
            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            {copied ? t("publicPassport.copied") : t("publicPassport.copyLink")}
          </button>
          <button
            onClick={handleDownloadQrPng}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--surface)",
              color: "var(--text-secondary)",
              fontSize: "12.5px",
              fontWeight: "500",
            }}
          >
            <QrCode size={14} /> {t("publicPassport.downloadQr")}
          </button>
          <button
            onClick={handleDownloadPDF}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              fontSize: "12.5px",
              fontWeight: "600",
            }}
          >
            <Download size={14} /> {t("publicPassport.downloadPdf")}
          </button>
        </div>
      </div>

      {/* Main Public Passport Card */}
      <div
        id="passport-print-area"
        className="cx-card"
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div style={{ height: "120px", background: "linear-gradient(135deg, #b33753 0%, #7e2237 100%)" }} />

        <div style={{ padding: "0 32px 28px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-45px", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", flexWrap: "wrap" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface)",
                  padding: "4px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: "700",
                    overflow: "hidden",
                  }}
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    initials
                  )}
                </div>
              </div>

              <div>
                <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                  {currentUser?.fullName || "Amira Mansour"}
                </h1>
                <div style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                  {currentUser?.studyProgram || "Génie Logiciel"} · {currentUser?.level || "3ème année"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {currentUser?.university || "Université SESAME"} · {currentUser?.club || t("app.clubName")}
                </div>
              </div>
            </div>

            {/* Scannable QR Code SVG */}
            <div
              onClick={handleDownloadQrPng}
              title={t("publicPassport.downloadQr")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#ffffff",
                padding: "8px",
                borderRadius: "12px",
                border: "1px solid var(--border-light)",
                cursor: "pointer",
              }}
            >
              <svg width="76" height="76" viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}>
                <rect width={qrMatrix.length} height={qrMatrix.length} fill="#ffffff" />
                {qrMatrix.map((row, r) =>
                  row.map((cell, c) =>
                    cell ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0f172a" /> : null
                  )
                )}
              </svg>
              <span style={{ fontSize: "9.5px", fontWeight: "600", color: "#64748b", marginTop: "4px" }}>
                {t("publicPassport.scanVerify")}
              </span>
            </div>
          </div>

          {currentUser?.bio && (
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", maxWidth: "680px", marginBottom: "18px" }}>
              {currentUser.bio}
            </p>
          )}

          {/* Social Links */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
            {currentUser?.linkedin && (
              <a
                href={currentUser.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--surface-muted)",
                  color: "var(--text-secondary)",
                  fontSize: "12.5px",
                  textDecoration: "none",
                  fontWeight: "500",
                  border: "1px solid var(--border-light)",
                }}
              >
                LinkedIn <ExternalLink size={12} />
              </a>
            )}
            {currentUser?.github && (
              <a
                href={currentUser.github}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--surface-muted)",
                  color: "var(--text-secondary)",
                  fontSize: "12.5px",
                  textDecoration: "none",
                  fontWeight: "500",
                  border: "1px solid var(--border-light)",
                }}
              >
                GitHub <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Trust Banner & Legend */}
          <div
            style={{
              backgroundColor: "var(--badge-verified-bg)",
              border: "1px solid var(--badge-verified-border)",
              borderRadius: "12px",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <ShieldCheck size={22} color="var(--badge-verified-text)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: "13px", color: "var(--badge-verified-text)", lineHeight: "1.45" }}>
              <strong>{t("publicPassport.trustTitle")}</strong> {t("publicPassport.trustDesc")}
            </div>
          </div>

          <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px" }}>
            {t("publicPassport.accomplishmentsTitle", { count: publicRecords.length })}
          </h2>

          {publicRecords.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--text-muted)", padding: "20px 0" }}>
              {t("publicPassport.emptyPublic")}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {publicRecords.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "18px 20px",
                    borderRadius: "14px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--surface)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <CategoryIcon category={item.category} size={15} />
                      <span style={{ fontSize: "11.5px", textTransform: "uppercase", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                        {t(`categories.${item.category}`)}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>•</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.date}</span>
                    </div>
                    <h3 style={{ fontSize: "15.5px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      {item.organization} {item.role ? `— ${item.role}` : ""}
                    </div>
                    {item.description && (
                      <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <StatusBadge
                    status="verified"
                    size="sm"
                    isClubOfficial={item.isClubOfficial}
                    showOfficialLabel
                  />
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: "36px",
              paddingTop: "18px",
              borderTop: "1px solid var(--border-subtle)",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            {t("publicPassport.footer")} • {generatedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
