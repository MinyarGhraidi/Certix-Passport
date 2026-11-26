import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppProvider, useApp } from "./services/AppContext";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./pages/AuthPages";
import { Sidebar, Header } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { DigitalPassportPage } from "./pages/DigitalPassportPage";
import { RecordsSectionPage, RecordModal } from "./pages/RecordsSectionPage";
import { PublicPassportPage } from "./pages/PublicPassportPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { SettingsProfilePage } from "./pages/SettingsProfilePage";
import { EventsListPage } from "./pages/EventsListPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventModal } from "./components/events/EventModal";
import { Medal, ArrowRight, ExternalLink, UserCheck, BookOpen, Share2 } from "lucide-react";
import "./styles/theme.css";

function BadgesPage() {
  const { t } = useTranslation();
  const { records, setActiveTab } = useApp();
  const verifiedCount = records.filter((r) => r.status === "verified").length;

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
      <div className="cx-card" style={{ padding: "32px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "var(--primary-light)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <Medal size={22} />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
          {t("badges.title")}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "18px" }}>
          {t("badges.subtitle")} ({verifiedCount} {t("status.verifiedShort")})
        </p>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
          {t("badges.empty")}
        </p>
        <button
          onClick={() => setActiveTab("achievements")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "var(--primary)",
            fontWeight: "600",
            fontSize: "14px",
            padding: 0,
          }}
        >
          {t("badges.explore")} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function HelpSupportPage() {
  const { t } = useTranslation();
  const { setActiveTab } = useApp();

  return (
    <div className="cx-page-pad" style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "22px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
          {t("help.title")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{t("help.subtitle")}</p>
      </div>

      <div
        style={{
          backgroundColor: "var(--surface-muted)",
          border: "1px solid var(--border-light)",
          borderRadius: "16px",
          padding: "22px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
            {t("help.needHandTitle")}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{t("help.needHandDesc")}</p>
        </div>
        <a
          href="mailto:club@sesame.com.tn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 16px",
            borderRadius: "10px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-light)",
            color: "var(--text-main)",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          <ExternalLink size={14} /> {t("help.contactAdmin")}
        </a>
      </div>

      <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px" }}>
        {t("help.gettingStarted")}
      </h2>

      <div className="cx-grid-3">
        {[
          { Icon: UserCheck, title: t("help.step1Title"), desc: t("help.step1Desc"), cta: t("help.step1Cta"), tab: "settings" },
          { Icon: BookOpen, title: t("help.step2Title"), desc: t("help.step2Desc"), cta: t("help.step2Cta"), tab: "passport" },
          { Icon: Share2, title: t("help.step3Title"), desc: t("help.step3Desc"), cta: t("help.step3Cta"), tab: "public-preview" },
        ].map(({ Icon, title, desc, cta, tab }) => (
          <div key={tab} className="cx-card" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "var(--primary)", marginBottom: "12px" }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>{title}</h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.55", marginBottom: "18px" }}>{desc}</p>
            </div>
            <button
              onClick={() => setActiveTab(tab)}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "13px", fontWeight: "600", textAlign: "left", padding: 0 }}
            >
              {cta} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { activeTab, notification } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (activeTab === "login") return <LoginPage />;
  if (activeTab === "register") return <RegisterPage />;
  if (activeTab === "forgot-password") return <ForgotPasswordPage />;
  if (activeTab === "public-preview") return <PublicPassportPage />;

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return t("nav.dashboard");
      case "passport":
        return t("nav.passport");
      case "events":
        return t("nav.events");
      case "event-details":
        return t("nav.eventDetails");
      case "achievements":
        return t("nav.achievements");
      case "certifications":
        return t("nav.certifications");
      case "experience":
        return t("nav.experience");
      case "activities":
        return t("nav.activities");
      case "projects":
        return t("nav.projects");
      case "badges":
        return t("nav.badges");
      case "settings":
        return t("nav.settings");
      case "admin":
        return t("nav.adminDashboard");
      case "help":
        return t("nav.help");
      default:
        return "CertiX Passport";
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--background)" }}>
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: notification.type === "error" ? "#dc2626" : "#0f172a",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            fontSize: "13.5px",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
            zIndex: 100,
          }}
        >
          {notification.message}
        </div>
      )}

      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
        <Header title={getHeaderTitle()} onOpenMobile={() => setMobileMenuOpen(true)} />

        <main style={{ flex: 1 }}>
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "passport" && <DigitalPassportPage />}
          {activeTab === "events" && <EventsListPage />}
          {activeTab === "event-details" && <EventDetailsPage />}
          {activeTab === "achievements" && (
            <RecordsSectionPage
              category="achievement"
              title={t("nav.achievements")}
              addLabel={t("passport.addItem")}
            />
          )}
          {activeTab === "certifications" && (
            <RecordsSectionPage
              category="certification"
              title={t("nav.certifications")}
              addLabel={t("addCertification")}
            />
          )}
          {activeTab === "experience" && (
            <RecordsSectionPage
              category="experience"
              title={t("nav.experience")}
              addLabel={t("passport.addItem")}
            />
          )}
          {activeTab === "activities" && (
            <RecordsSectionPage
              category="activity"
              title={t("nav.activities")}
              addLabel={t("passport.addItem")}
            />
          )}
          {activeTab === "projects" && (
            <RecordsSectionPage
              category="project"
              title={t("nav.projects")}
              addLabel={t("passport.addItem")}
            />
          )}
          {activeTab === "badges" && <BadgesPage />}
          {activeTab === "settings" && <SettingsProfilePage />}
          {activeTab === "admin" && <AdminDashboardPage />}
          {activeTab === "help" && <HelpSupportPage />}
        </main>
      </div>

      <RecordModal />
      <EventModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
