import { useEffect, useState } from "react";
import AppShell from "../components/settings/AppShell.jsx";
import ProfileCard from "../components/settings/ProfileCard.jsx";
import LinksCard from "../components/settings/LinksCard.jsx";
import { getProfile } from "../services/profileApi.js";

const THEME_KEY = "certix-settings-theme";

function readTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function SettingsPage({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [theme, setTheme] = useState(readTheme);

  const [attempt, setAttempt] = useState(0); // incrémenté par "Try again"

  useEffect(() => {
    let cancelled = false;
    getProfile()
      .then((data) => !cancelled && setProfile(data))
      .catch(() => !cancelled && setLoadFailed(true));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setLoadFailed(false);
    setAttempt((n) => n + 1);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* stockage indisponible : le thème ne sera pas mémorisé */
    }
  };

  return (
    <AppShell profile={profile} theme={theme} onToggleTheme={toggleTheme} onNavigate={onNavigate}>
      {loadFailed && (
        <section className="st-card">
          <p className="st-error" role="alert">Could not load your profile. Is the server running?</p>
          <div className="st-actions">
            <button type="button" className="st-btn st-btn-primary" onClick={retry}>Try again</button>
          </div>
        </section>
      )}
      {!profile && !loadFailed && <p className="st-muted" role="status">Loading…</p>}
      {profile && (
        <>
          <ProfileCard profile={profile} onProfileChange={setProfile} />
          <LinksCard profile={profile} onProfileChange={setProfile} />
        </>
      )}
    </AppShell>
  );
}

export default SettingsPage;
