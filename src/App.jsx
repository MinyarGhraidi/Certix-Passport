
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Button from "./components/Button.jsx";
import Card from "./components/ui/Card.jsx";
import Title from "./components/ui/Title.jsx";
import Subtitle from "./components/ui/Subtitle.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const palettes = {
  "Tech Blue": {
    primary: "#2563eb",
    secondary: "#06b6d4",
    background: "#f8fafc",
    surface: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
  },
  "Cyber Purple": {
    primary: "#7c3aed",
    secondary: "#a78bfa",
    background: "#f8f7ff",
    surface: "#ffffff",
    text: "#1e1b4b",
    muted: "#6b6585",
  },
  "Emerald Green": {
    primary: "#059669",
    secondary: "#34d399",
    background: "#f3faf7",
    surface: "#ffffff",
    text: "#102a22",
    muted: "#61756d",
  },
  "Midnight Dark": {
    primary: "#38bdf8",
    secondary: "#a78bfa",
    background: "#0b1120",
    surface: "#151f32",
    text: "#f1f5f9",
    muted: "#9aa9bd",
  },
  "Orange Energy": {
    primary: "#ea580c",
    secondary: "#fbbf24",
    background: "#fffbf5",
    surface: "#ffffff",
    text: "#292018",
    muted: "#786b60",
  },
  "Minimal Mono": {
    primary: "#27272a",
    secondary: "#71717a",
    background: "#fafafa",
    surface: "#ffffff",
    text: "#18181b",
    muted: "#71717a",
  },
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: "15px",
};

function App() {
  const { t, i18n } = useTranslation();

  const [certifications, setCertifications] = useState(() => {
    try {
      const savedCertifications = localStorage.getItem("certix-certifications");
      return savedCertifications ? JSON.parse(savedCertifications) : [];
    } catch {
      return [];
    }
  });
  
  useEffect(() => {
    localStorage.setItem(
      "certix-certifications",
      JSON.stringify(certifications)
    );
  }, [certifications]);
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [category, setCategory] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState("certifications"); // "certifications" | "settings"

  const changePalette = (paletteName) => {
    const colors = palettes[paletteName];

    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  const addCertification = (event) => {
    event.preventDefault();

    if (!name.trim() || !issuer.trim() || !category || !issueDate) {
      setError(t("requiredFields"));
      return;
    }

    const newCertification = {
      id: `${Date.now()}-${Math.random()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      category,
      issueDate,
    };

    setCertifications((previous) => [
      ...previous,
      newCertification,
    ]);

    setName("");
    setIssuer("");
    setCategory("");
    setIssueDate("");
    setError("");
  };

  const removeCertification = (id) => {
    setCertifications((previous) =>
      previous.filter((certification) => certification.id !== id)
    );
  };

  const progress = Math.min(
    100,
    Math.round((certifications.length / 5) * 100)
  );

  const categories = [
    { value: "technology", label: t("technology") },
    { value: "business", label: t("business") },
    { value: "design", label: t("design") },
    { value: "marketing", label: t("marketing") },
    { value: "other", label: t("other") },
  ];

  if (page === "settings") return <SettingsPage onNavigate={setPage} />;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background: "var(--background)",
        color: "var(--text)",
        transition: "background 0.2s",
      }}
    >
      <div style={{ maxWidth: "850px", margin: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Title level={1}>CertiX Passport</Title>

          <nav style={{ display: "flex", gap: "8px" }}>
            <Button
              variant={page === "certifications" ? "primary" : "secondary"}
              onClick={() => setPage("certifications")}
            >
              {t("nav.certifications")}
            </Button>
            <Button
              variant={page === "settings" ? "primary" : "secondary"}
              onClick={() => setPage("settings")}
            >
              {t("nav.settings")}
            </Button>
          </nav>

          <select
            aria-label="Language"
            value={i18n.language?.startsWith("fr") ? "fr" : "en"}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            style={{ ...inputStyle, width: "auto", marginTop: 0 }}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        <>
        <Subtitle>{t("description")}</Subtitle>

        <Card title={t("choosePalette")}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            

            {Object.entries(palettes).map(([paletteName, colors]) => {
  const paletteKeys = {
    "Tech Blue": "paletteTechBlue",
    "Cyber Purple": "paletteCyberPurple",
    "Emerald Green": "paletteEmeraldGreen",
    "Midnight Dark": "paletteMidnightDark",
    "Orange Energy": "paletteOrangeEnergy",
    "Minimal Mono": "paletteMinimalMono"
  };

  return (
    <Button
      key={paletteName}
      onClick={() => changePalette(paletteName)}
      style={{
        background: colors.primary,
        color: "#ffffff"
      }}
    >
      {t(paletteKeys[paletteName])}
    </Button>
  );
})}


          </div>
        </Card>

        <div style={{ marginTop: "24px" }}>
          <Card title={t("addCertification")}>
            <form
              onSubmit={addCertification}
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <label>
                {t("certificationName")} *
                <input
                  style={inputStyle}
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("certificationNamePlaceholder")}
                  required
                />
              </label>

              <label>
                {t("issuer")} *
                <input
                  style={inputStyle}
                  type="text"
                  value={issuer}
                  onChange={(event) => setIssuer(event.target.value)}
                  placeholder={t("issuerPlaceholder")}
                  required
                />
              </label>

              <label>
                {t("category")} *
                <select
                  style={inputStyle}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                >
                  <option value="">{t("chooseCategory")}</option>
                  {categories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                {t("issueDate")} *
                <input
                  style={inputStyle}
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                  required
                />
              </label>

              {error && (
                <p role="alert" style={{ color: "#dc2626" }}>
                  {error}
                </p>
              )}

              <div>
                <Button type="submit">{t("add")}</Button>
              </div>
            </form>
          </Card>
        </div>

        <div style={{ marginTop: "24px" }}>
          <Card title={t("myCertifications")}>
            <Subtitle>{t("preview")}</Subtitle>

            <div
              style={{
                height: "12px",
                background: "var(--secondary)",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "var(--primary)",
                  transition: "width 0.3s",
                }}
              />
            </div>

            <Subtitle>
              {t("progress")}: {progress}% ({certifications.length}/5)
            </Subtitle>

            {certifications.length === 0 ? (
              <p style={{ color: "var(--muted)", marginTop: "16px" }}>
                {t("emptyState")}
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginTop: "20px",
                }}
              >
                {certifications.map((certification) => (
                  <article
                    key={certification.id}
                    style={{
                      padding: "18px",
                      border: "1px solid var(--secondary)",
                      borderRadius: "12px",
                      background: "var(--surface)",
                    }}
                  >
                    <h3 style={{ marginBottom: "8px" }}>
                      {certification.name}
                    </h3>

                    <p style={{ color: "var(--muted)", marginBottom: "6px" }}>
                      {certification.issuer}
                    </p>

                    <p style={{ marginBottom: "6px" }}>
                      {t(certification.category)}
                    </p>

                    <p style={{ color: "var(--muted)", marginBottom: "14px" }}>
                      {certification.issueDate}
                      {certification.issueDate &&
                       new Intl.DateTimeFormat(
                       i18n.language?.startsWith("fr") ? "fr-FR" : "en-US",
                       {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      }
                      ).format(
                       new Date(`${certification.issueDate}T00:00:00Z`)
                                                                       )}
                    </p>

                    <Button
                      variant="secondary"
                      onClick={() => removeCertification(certification.id)}
                    >
                       {t("remove")}
                      
                      
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </Card>
        </div>
        </>
      </div>
    </main>
  );
}

export default App;
