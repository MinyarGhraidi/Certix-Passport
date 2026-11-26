import React from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../services/AppContext";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { USE_MOCK_API } from "../../services/apiClient";
import {
  LayoutDashboard,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  FolderGit2,
  Medal,
  Settings,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Share2,
  Menu,
  X,
} from "lucide-react";

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { t } = useTranslation();
  const { activeTab, setActiveTab, currentUser, logout } = useApp();

  const navigate = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const menuSections = [
    {
      heading: t("nav.sections.workspace"),
      items: [
        { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
        { id: "passport", label: t("nav.passport"), icon: Award },
        { id: "events", label: t("nav.events"), icon: Calendar },
      ],
    },
    {
      heading: t("nav.sections.records"),
      items: [
        { id: "achievements", label: t("nav.achievements"), icon: Award },
        { id: "certifications", label: t("nav.certifications"), icon: BookOpen },
        { id: "experience", label: t("nav.experience"), icon: Briefcase },
        { id: "activities", label: t("nav.activities"), icon: Calendar },
        { id: "projects", label: t("nav.projects"), icon: FolderGit2 },
        { id: "badges", label: t("nav.badges"), icon: Medal },
      ],
    },
    {
      heading: t("nav.sections.account"),
      items: [
        { id: "settings", label: t("nav.settings"), icon: Settings },
        { id: "help", label: t("nav.help"), icon: HelpCircle },
      ],
    },
  ];

  if (currentUser?.role === "admin") {
    menuSections.unshift({
      heading: t("nav.sections.admin"),
      items: [{ id: "admin", label: t("nav.adminDashboard"), icon: ShieldCheck }],
    });
  }

  return (
    <>
      <div
        className={`cx-sidebar-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={onCloseMobile}
      />
      <aside
        className={`cx-sidebar cx-no-print ${mobileOpen ? "open" : ""}`}
        style={{
          width: "264px",
          height: "100vh",
          position: "sticky",
          top: 0,
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          padding: "20px 16px",
          overflowY: "auto",
        }}
      >
        {/* Brand logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "22px",
            paddingLeft: "8px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
            onClick={() => navigate("dashboard")}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 8px rgba(179,55,83,0.28)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <span style={{ fontSize: "21px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.5px" }}>
              {t("app.brand")}
            </span>
          </div>

          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              style={{ background: "none", border: "none", color: "var(--text-muted)", padding: "4px" }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Club Workspace Card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-muted)",
            marginBottom: "22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "8px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-main)" }}>
                {t("app.clubName")}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {currentUser?.role === "admin" ? t("app.adminWorkspaceRole") : t("app.workspaceRole")}
              </div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>

        {/* Nav Menu */}
        <div style={{ flex: 1 }}>
          {menuSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "10.5px",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                  letterSpacing: "0.6px",
                  paddingLeft: "10px",
                  marginBottom: "8px",
                }}
              >
                {sec.heading}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {sec.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive =
                    activeTab === item.id || (item.id === "events" && activeTab === "event-details");
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                        color: isActive ? "var(--primary)" : "var(--text-secondary)",
                        fontWeight: isActive ? "600" : "500",
                        fontSize: "13.5px",
                        textAlign: "left",
                        transition: "0.15s ease",
                      }}
                    >
                      <IconComponent
                        size={17}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        color={isActive ? "var(--primary)" : "var(--text-muted)"}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Backend status pill + Public Preview + Logout */}
        <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "var(--text-muted)",
              padding: "4px 10px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: USE_MOCK_API ? "#f59e0b" : "#10b981",
              }}
            />
            <span>{USE_MOCK_API ? t("app.demoMode") : t("app.apiConnected")}</span>
          </div>

          <button
            onClick={() => navigate("public-preview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--surface)",
              color: "var(--primary)",
              fontSize: "12.5px",
              fontWeight: "600",
            }}
          >
            <Share2 size={15} />
            <span>{t("nav.publicPassport")}</span>
            <ExternalLink size={12} style={{ marginLeft: "auto" }} />
          </button>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: "500",
            }}
          >
            <LogOut size={15} />
            <span>{t("nav.signOut")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function Header({ title, onOpenMobile }) {
  const { t } = useTranslation();
  const { currentUser, setActiveTab, theme, toggleTheme } = useApp();
  const initials =
    currentUser?.firstName && currentUser?.lastName
      ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
      : "AM";

  return (
    <header
      className="cx-no-print"
      style={{
        height: "64px",
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="cx-mobile-menu-btn"
          onClick={onOpenMobile}
          aria-label="Open menu"
          style={{
            background: "none",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "6px",
            color: "var(--text-main)",
          }}
        >
          <Menu size={18} />
        </button>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)" }}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Language FR / EN Switcher */}
        <LanguageSwitcher compact />

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={t("header.toggleTheme")}
          aria-label={t("header.toggleTheme")}
          style={{
            background: "none",
            border: "1px solid var(--border-light)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "7px",
            borderRadius: "9999px",
          }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User Avatar */}
        <div
          onClick={() => setActiveTab("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "13px",
              overflow: "hidden",
              border: "1px solid var(--border-light)",
            }}
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initials
            )}
          </div>
          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>
            {currentUser?.fullName || "Amira Mansour"}
          </span>
        </div>
      </div>
    </header>
  );
}
