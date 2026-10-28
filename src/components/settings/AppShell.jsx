import {
  LayoutDashboard, IdCard, Trophy, Award, Briefcase, CalendarDays,
  Folder, Settings, Layers, ChevronDown, Moon, Sun,
} from "lucide-react";
import Avatar from "./Avatar.jsx";
import { initialsOf } from "./initials.js";

// Seuls "Certifications" et "Settings" ont une page pour l'instant.
const NAV = [
  {
    title: "WORKSPACE",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "passport", label: "My Digital Passport", icon: IdCard },
    ],
  },
  {
    title: "MY RECORDS",
    items: [
      { id: "achievements", label: "Achievements", icon: Trophy },
      { id: "certifications", label: "Certifications", icon: Award },
      { id: "experience", label: "Experience", icon: Briefcase },
      { id: "activities", label: "Activities", icon: CalendarDays },
      { id: "projects", label: "Personal Projects", icon: Folder },
      { id: "badges", label: "Badges & Milestones", icon: Award },
    ],
  },
  { title: "ACCOUNT", items: [{ id: "settings", label: "Settings", icon: Settings }] },
];

function AppShell({ profile, theme, onToggleTheme, onNavigate, children }) {
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";

  return (
    <div className="st-shell" data-theme={theme}>
      <aside className="st-sidebar">
        <div className="st-logo">
          <span className="st-logo-mark"><IdCard size={28} aria-hidden="true" /></span>
          <span className="st-logo-text">CertiX</span>
        </div>

        <div className="st-workspace">
          <span className="st-workspace-icon"><Layers size={22} aria-hidden="true" /></span>
          <span>
            <strong>CertiX Club</strong>
            <small>Member workspace</small>
          </span>
          <ChevronDown size={18} aria-hidden="true" />
        </div>

        <nav aria-label="Main navigation">
          {NAV.map((group) => (
            <div key={group.title}>
              <p className="st-nav-title">{group.title}</p>
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = id === "settings";
                const goes = id === "certifications";
                return (
                  <button
                    key={id}
                    type="button"
                    className={`st-nav-item ${active ? "is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    disabled={!active && !goes}
                    onClick={goes ? () => onNavigate("certifications") : undefined}
                  >
                    <Icon size={22} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="st-main">
        <header className="st-topbar">
          <h1>Settings</h1>
          <div className="st-topbar-user">
            <button type="button" className="st-icon-btn" onClick={onToggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <Avatar className="st-avatar-small" src={profile?.avatarUrl} initials={initialsOf(profile)} />
            <span>{fullName}</span>
          </div>
        </header>

        <main className="st-content">{children}</main>
      </div>
    </div>
  );
}

export default AppShell;
