import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Title from "../components/ui/Title.jsx";
import Subtitle from "../components/ui/Subtitle.jsx";
import { Field, inputStyle, errorStyle, pageStyle } from "../components/Field.jsx";
import { api } from "../api.js";

/* FCP-37 : Login
   Props (tout est optionnel) :
   - onSuccess(role)  : appelé avec "student" ou "admin" -> à toi de rediriger (router)
   - onForgot()       : ouvre la page de récupération du mot de passe
   - onRegister()     : ouvre la page Register
   Sans onSuccess, la page redirige vers /passport (étudiant) ou /admin (admin). */
function Login({ onSuccess, onForgot, onRegister }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const found = {};
    if (!email.trim()) found.email = t("loginErrEmail", "Enter your email.");
    if (!password) found.password = t("loginErrPassword", "Enter your password.");
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const result = await api("/auth/login", { method: "POST", body: { email: email.trim(), password } });
      if (result.ok) {
        const role = result.body.role === "admin" ? "admin" : "student";   // redirection selon le rôle
        if (onSuccess) onSuccess(role);
        else window.location.assign(role === "admin" ? "/admin" : "/passport");
        return;
      }
      // message générique : on ne dit jamais si c'est l'email ou le mot de passe
      setFormError(
        result.status === 400 || result.status === 401
          ? t("loginErrInvalid", "Incorrect email or password.")
          : t("loginErrServer", "Something went wrong. Please try again.")
      );
    } catch {
      setFormError(t("errNetwork", "We couldn’t reach the server. Check your connection and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "440px", margin: "auto" }}>
        <Title level={1}>{t("loginTitle", "Log in")}</Title>
        <Subtitle>{t("loginSubtitle", "Welcome back.")}</Subtitle>

        <div style={{ marginTop: "20px" }}>
          <Card title={t("loginCardTitle", "Your account")}>
            {formError && <p role="alert" style={errorStyle}>{formError}</p>}

            <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: "16px" }}>
              <Field label={t("regEmail", "Email")} error={errors.email}>
                <input style={inputStyle} type="email" inputMode="email" autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>

              <Field label={t("regPassword", "Password")} error={errors.password}>
                <input style={inputStyle} type="password" autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>

              <div>
                <Button type="submit" disabled={loading}>
                  {loading ? t("loginLoading", "Logging in…") : t("loginSubmit", "Log in")}
                </Button>
              </div>
            </form>

            <p style={{ marginTop: "16px" }}>
              <a href="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600 }}
                onClick={(e) => { if (onForgot) { e.preventDefault(); onForgot(); } }}>
                {t("loginForgot", "Forgot your password?")}
              </a>
            </p>
          </Card>
        </div>

        <p style={{ marginTop: "16px", color: "var(--muted)" }}>
          {t("loginNoAccount", "New here?")}{" "}
          <a href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}
            onClick={(e) => { if (onRegister) { e.preventDefault(); onRegister(); } }}>
            {t("loginCreate", "Create an account")}
          </a>
        </p>
      </div>
    </main>
  );
}

export default Login;
