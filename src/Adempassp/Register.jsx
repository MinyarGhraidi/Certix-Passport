import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Title from "../components/ui/Title.jsx";
import Subtitle from "../components/ui/Subtitle.jsx";

/* FCP-36 : Register an account
   - API : mets VITE_API_URL dans un fichier .env (ex: VITE_API_URL=https://api.exemple.tn)
     Si la variable est vide, la page tourne en mode démo (fausse réponse du serveur).
   - Textes : t("clé", "texte par défaut") -> fonctionne même avant d'ajouter les
     traductions ; les clés EN/FR sont dans register-translations.json. */

const API_URL = import.meta.env.VITE_API_URL || "";

const PROGRAMS = ["Computer Science", "Engineering", "Business", "Other"];
const LEVELS = [
  "Preparatory year 1",
  "Preparatory year 2",
  "Licence 1",
  "Licence 2",
  "Licence 3",
  "Master 1",
  "Master 2",
];

const passwordRules = {
  len: (v) => v.length >= 8,
  upper: (v) => /[A-Z]/.test(v),
  num: (v) => /\d/.test(v),
};

// même style que inputStyle de App.jsx
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

const errorStyle = { color: "#dc2626", fontSize: "14px", marginTop: "6px" };

/* Format d'erreur attendu du backend (à confirmer avec l'équipe) :
   HTTP 422 -> { "errors": { "email": "This email is already registered." } } */
async function registerRequest(data) {
  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (data.email.toLowerCase() === "taken@test.com") {
      return {
        ok: false,
        body: { errors: { email: "This email is already registered." } },
      };
    }
    return { ok: true, body: {} };
  }

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let body = {};
  try {
    body = await response.json();
  } catch {
    /* réponse sans JSON */
  }
  return { ok: response.ok, body };
}

function Register({ onLogin }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    program: "",
    level: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const validate = () => {
    const found = {};
    if (!form.displayName.trim())
      found.displayName = t("regErrName", "Enter a display name.");
    if (!form.email.trim()) found.email = t("regErrEmail", "Enter your email.");
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      found.email = t("regErrEmailInvalid", "Enter a valid email address.");
    if (!form.password)
      found.password = t("regErrPassword", "Create a password.");
    else if (!Object.values(passwordRules).every((rule) => rule(form.password)))
      found.password = t(
        "regErrPasswordRules",
        "Your password doesn’t meet all the rules."
      );
    if (!form.program)
      found.program = t("regErrProgram", "Select your study program.");
    if (!form.level) found.level = t("regErrLevel", "Select your level.");
    return found;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const result = await registerRequest(form);

      if (result.ok) {
        setSentTo(form.email); // état de succès + étape suivante
        return;
      }

      // erreurs par champ renvoyées par le backend
      const serverErrors = result.body?.errors || {};
      if (Object.keys(serverErrors).length > 0) {
        setErrors(serverErrors);
      } else {
        throw new Error("server");
      }
    } catch {
      setFormError(
        t(
          "regErrNetwork",
          "We couldn’t create your passport. Check your connection and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- État de succès : confirmation d'email ---------- */
  if (sentTo) {
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: "460px", margin: "auto" }}>
          <Card title={t("regSuccessTitle", "Check your email")}>
            <Subtitle>
              {t(
                "regSuccessText",
                "We sent a confirmation link to {{email}}. Open it to activate your passport, then log in.",
                { email: sentTo }
              )}
            </Subtitle>
            <div style={{ marginTop: "16px" }}>
              <Button onClick={onLogin}>{t("regLogin", "Go to log in")}</Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ---------- Formulaire ---------- */
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "460px", margin: "auto" }}>
        <Title level={1}>{t("regTitle", "Create your passport")}</Title>
        <Subtitle>{t("regSubtitle", "It takes less than a minute.")}</Subtitle>

        <div style={{ marginTop: "20px" }}>
          <Card title={t("regCardTitle", "Register")}>
            {formError && (
              <p role="alert" style={errorStyle}>
                {formError}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "grid", gap: "16px" }}
            >
              <label>
                {t("regDisplayName", "Display name")} *
                <input
                  style={inputStyle}
                  type="text"
                  autoComplete="name"
                  value={form.displayName}
                  onChange={update("displayName")}
                />
                {errors.displayName && (
                  <p role="alert" style={errorStyle}>{errors.displayName}</p>
                )}
              </label>

              <label>
                {t("regEmail", "Email")} *
                <input
                  style={inputStyle}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                />
                {errors.email && (
                  <p role="alert" style={errorStyle}>{errors.email}</p>
                )}
              </label>

              <label>
                {t("regPassword", "Password")} *
                <div style={{ position: "relative" }}>
                  <input
                    style={{ ...inputStyle, paddingRight: "70px" }}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={update("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-30%)",
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {showPassword ? t("regHide", "Hide") : t("regShow", "Show")}
                  </button>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", fontSize: "14px" }}>
                  {[
                    ["len", t("regRuleLen", "At least 8 characters")],
                    ["upper", t("regRuleUpper", "One uppercase letter")],
                    ["num", t("regRuleNum", "One number")],
                  ].map(([key, label]) => (
                    <li
                      key={key}
                      style={{
                        color: passwordRules[key](form.password)
                          ? "#059669"
                          : "var(--muted)",
                      }}
                    >
                      {passwordRules[key](form.password) ? "● " : "○ "}
                      {label}
                    </li>
                  ))}
                </ul>

                {errors.password && (
                  <p role="alert" style={errorStyle}>{errors.password}</p>
                )}
              </label>

              <label>
                {t("regProgram", "Study program")} *
                <select
                  style={inputStyle}
                  value={form.program}
                  onChange={update("program")}
                >
                  <option value="">{t("regSelect", "Select…")}</option>
                  {PROGRAMS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                {errors.program && (
                  <p role="alert" style={errorStyle}>{errors.program}</p>
                )}
              </label>

              <label>
                {t("regLevel", "Level")} *
                <select
                  style={inputStyle}
                  value={form.level}
                  onChange={update("level")}
                >
                  <option value="">{t("regSelect", "Select…")}</option>
                  {LEVELS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                {errors.level && (
                  <p role="alert" style={errorStyle}>{errors.level}</p>
                )}
              </label>

              <div>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? t("regLoading", "Creating your passport…")
                    : t("regSubmit", "Create my passport")}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <p style={{ marginTop: "16px", color: "var(--muted)" }}>
          {t("regHaveAccount", "Already a member?")}{" "}
          <a
            href="/login"
            onClick={(event) => {
              if (onLogin) {
                event.preventDefault();
                onLogin();
              }
            }}
            style={{ color: "var(--primary)", fontWeight: 600 }}
          >
            {t("regLogin", "Go to log in")}
          </a>
        </p>
      </div>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px",
  background: "var(--background)",
  color: "var(--text)",
};

export default Register;
