import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { authService } from "../services/authService";
import { Upload, Copy, Check, ExternalLink } from "lucide-react";

export function SettingsProfilePage() {
  const { t } = useTranslation();
  const { currentUser, updateProfile, showNotification, setActiveTab } = useApp();

  const [firstName, setFirstName] = useState(currentUser?.firstName || "Amira");
  const [lastName, setLastName] = useState(currentUser?.lastName || "Mansour");
  const [username, setUsername] = useState(currentUser?.username || "amira.mansour");
  const [university, setUniversity] = useState(currentUser?.university || "Université SESAME");
  const [club, setClub] = useState(currentUser?.club || "Club SESAME");
  const [studyProgram, setStudyProgram] = useState(currentUser?.studyProgram || "Génie Logiciel");
  const [level, setLevel] = useState(currentUser?.level || "3ème année");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [website, setWebsite] = useState(currentUser?.website || "");
  const [linkedin, setLinkedin] = useState(currentUser?.linkedin || "");
  const [github, setGithub] = useState(currentUser?.github || "");
  const [publicSharingActive, setPublicSharingActive] = useState(currentUser?.publicSharingActive ?? true);

  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedSlug, setCopiedSlug] = useState(false);

  const slug = currentUser?.publicSlug || "amira-mansour-782";
  const baseUrl = import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin;
  const publicUrl = `${baseUrl}/p/${slug}`;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      showNotification(t("records.modal.fileFormatError"), "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotification(t("records.modal.fileSizeError"), "error");
      return;
    }

    try {
      const res = await authService.uploadAvatar(file, (pct) => setUploadProgress(pct));
      const newUrl = res?.avatarUrl || URL.createObjectURL(file);
      setAvatarPreview(newUrl);
      await updateProfile({ avatar: newUrl });
      setTimeout(() => setUploadProgress(0), 800);
    } catch (err) {
      showNotification(err.message || "Erreur upload photo", "error");
      setUploadProgress(0);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (bio.length > 300) {
      showNotification(t("settings.bioCounter", { count: bio.length }), "error");
      return;
    }

    await updateProfile({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      username,
      university,
      club,
      studyProgram,
      level,
      bio,
      website,
      linkedin,
      github,
      publicSharingActive,
      avatar: avatarPreview,
    });
  };

  const handleCopyPublic = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedSlug(true);
    showNotification(t("notifications.linkCopied"));
    setTimeout(() => setCopiedSlug(false), 2500);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border-light)",
    backgroundColor: "var(--surface)",
    color: "var(--text-main)",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
          {t("settings.title")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("settings.subtitle")}</p>
      </div>

      <div className="cx-card" style={{ overflow: "hidden", marginBottom: "28px" }}>
        <div style={{ height: "140px", background: "linear-gradient(135deg, #b33753 0%, #7e2237 100%)" }} />

        <div style={{ padding: "0 28px 28px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "-45px", marginBottom: "20px", flexWrap: "wrap", gap: "14px" }}>
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
                  fontSize: "24px",
                  fontWeight: "700",
                  overflow: "hidden",
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  `${firstName[0] || "A"}${lastName[0] || "M"}`.toUpperCase()
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-light)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-main)",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <Upload size={14} /> {t("settings.updateAvatar")}
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} style={{ display: "none" }} />
              </label>

              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(null);
                  updateProfile({ avatar: null });
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-light)",
                  backgroundColor: "var(--surface)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
              >
                {t("settings.removeAvatar")}
              </button>
            </div>
          </div>

          {uploadProgress > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ height: "4px", backgroundColor: "var(--border-light)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${uploadProgress}%`, height: "100%", backgroundColor: "var(--primary)", transition: "width 0.2s" }} />
              </div>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="cx-grid-2" style={{ marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.firstName")}
                </label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.lastName")}
                </label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div className="cx-grid-2" style={{ marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.username")}
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.website")}
                </label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div className="cx-grid-2" style={{ marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.university")}
                </label>
                <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.club")}
                </label>
                <input type="text" value={club} onChange={(e) => setClub(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div className="cx-grid-2" style={{ marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.studyProgram")}
                </label>
                <input type="text" value={studyProgram} onChange={(e) => setStudyProgram(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.level")}
                </label>
                <input type="text" value={level} onChange={(e) => setLevel(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)" }}>
                  {t("settings.shortBio")}
                </label>
                <span style={{ fontSize: "12px", color: bio.length > 300 ? "var(--badge-rejected-text)" : "var(--text-muted)" }}>
                  {t("settings.bioCounter", { count: bio.length })}
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            <div className="cx-grid-2" style={{ marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.linkedin")}
                </label>
                <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("settings.github")}
                </label>
                <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Public Sharing Toggle & Copy Link */}
            <div
              style={{
                backgroundColor: "var(--surface-muted)",
                padding: "16px 20px",
                borderRadius: "12px",
                border: "1px solid var(--border-light)",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>
                    {t("settings.sharingTitle")}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t("settings.sharingDesc", { slug })}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={publicSharingActive}
                  onChange={(e) => setPublicSharingActive(e.target.checked)}
                  style={{ width: "20px", height: "20px", accentColor: "var(--primary)", cursor: "pointer" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t("settings.publicUrlLabel")}</span>
                <code style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>{publicUrl}</code>
                <button
                  type="button"
                  onClick={handleCopyPublic}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--border-light)", backgroundColor: "var(--surface)", color: "var(--text-secondary)", fontSize: "11.5px" }}
                >
                  {copiedSlug ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                  {copiedSlug ? t("publicPassport.copied") : t("publicPassport.copyLink")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("public-preview")}
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "6px", border: "none", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontSize: "11.5px", fontWeight: "600" }}
                >
                  {t("nav.publicPassport")} <ExternalLink size={12} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                style={{
                  padding: "11px 24px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "var(--primary)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {t("settings.saveBtn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
