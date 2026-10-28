import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Subtitle from "../components/ui/Subtitle.jsx";
import { Field, inputStyle, errorStyle, pageStyle } from "../components/Field.jsx";
import { api } from "../api.js";

/* FCP-38 : récupération du mot de passe + confirmation d'email
   Props :
   - mode  : "forgot" (demande de lien) | "reset" (nouveau mot de passe) | "confirm" (confirmation email)
   - token : le jeton lu dans l'URL (pour "reset" et "confirm")
   - onLogin() / onForgot() : navigation (optionnelles)
   Test démo : token "expired" = lien expiré. */
const rules = {
  len: (v) => v.length >= 8,
  upper: (v) => /[A-Z]/.test(v),
  num: (v) => /\d/.test(v),
};

// Lien de navigation : appelle action() si elle existe, sinon suit href
function link(label, action, href) {
  return (
    <a href={href} style={{ color: "var(--primary)", fontWeight: 600 }}
      onClick={(e) => { if (action) { e.preventDefault(); action(); } }}>{label}</a>
  );
}

function Wrap({ title, children }) {
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "440px", margin: "auto" }}>
        <Card title={title}>{children}</Card>
      </div>
    </main>
  );
}

function AccountRecovery({ mode = "forgot", token = "", onLogin, onForgot }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");   // form | sent | done | expired
  const [confirmState, setConfirmState] = useState("loading");   // loading | ok | failed
  const [attempt, setAttempt] = useState(0);

  // Confirmation d'email : appel au backend à l'ouverture de la page
  useEffect(() => {
    if (mode !== "confirm") return;
    let active = true;
    setConfirmState("loading");
    api("/auth/confirm-email", { method: "POST", body: { token } })
      .then((r) => active && setConfirmState(r.ok ? "ok" : "failed"))
      .catch(() => active && setConfirmState("failed"));
    return () => { active = false; };
  }, [mode, token, attempt]);

  const networkMessage = t("errNetwork", "We couldn’t reach the server. Check your connection and try again.");

  /* ---------- Lien expiré ou invalide ---------- */
  const expired = (
    <Wrap title={t("recExpiredTitle", "This link has expired")}>
      <Subtitle>{t("recExpiredText", "The reset link is invalid or no longer active. Request a new one to continue.")}</Subtitle>
      <p style={{ marginTop: "16px" }}>{link(t("recRequestNew", "Request a new link"), onForgot, "/forgot-password")}</p>
    </Wrap>
  );

  /* ---------- Confirmation d'email ---------- */
  if (mode === "confirm") {
    return (
      <Wrap title={t("recConfirmTitle", "Email confirmation")}>
        {confirmState === "loading" ? (
          <Subtitle>{t("recConfirming", "Confirming your email…")}</Subtitle>
        ) : confirmState === "ok" ? (
          <>
            <Subtitle>{t("recConfirmed", "Your email is confirmed. You can now log in.")}</Subtitle>
            <div style={{ marginTop: "16px" }}><Button onClick={onLogin}>{t("regLogin", "Go to log in")}</Button></div>
          </>
        ) : (
          <>
            <p role="alert" style={errorStyle}>{t("recConfirmFailed", "This confirmation link is invalid or has expired.")}</p>
            <div style={{ marginTop: "16px" }}><Button onClick={() => setAttempt((n) => n + 1)}>{t("recRetry", "Try again")}</Button></div>
          </>
        )}
      </Wrap>
    );
  }

  /* ---------- Demande de lien (mot de passe oublié) ---------- */
  if (mode === "forgot") {
    const submitForgot = async (event) => {
      event.preventDefault();
      setFormError("");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setErrors({ email: t("regErrEmailInvalid", "Enter a valid email address.") });
      setErrors({});
      setLoading(true);
      try {
        const r = await api("/auth/forgot-password", { method: "POST", body: { email } });
        // même réponse que l'email existe ou non : on ne révèle rien
        if (r.ok || r.status === 404 || r.status === 422) setStep("sent");
        else setFormError(t("recSendFailed", "We couldn’t send the link right now. Please try again in a few minutes."));
      } catch {
        setFormError(networkMessage);
      } finally {
        setLoading(false);
      }
    };

    if (step === "sent")
      return (
        <Wrap title={t("regSuccessTitle", "Check your email")}>
          <Subtitle>{t("recSent", "If an account exists for {{email}}, we sent a link to reset your password.", { email })}</Subtitle>
          <p style={{ marginTop: "16px" }}>{link(t("recBack", "Back to log in"), onLogin, "/login")}</p>
        </Wrap>
      );

    return (
      <Wrap title={t("recForgotTitle", "Reset your password")}>
        <Subtitle>{t("recForgotText", "Enter your email and we’ll send you a reset link.")}</Subtitle>
        {formError && <p role="alert" style={errorStyle}>{formError}</p>}
        <form onSubmit={submitForgot} noValidate style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
          <Field label={t("regEmail", "Email")} error={errors.email}>
            <input style={inputStyle} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <div><Button type="submit" disabled={loading}>{loading ? t("loginLoading", "Please wait…") : t("recSendLink", "Send reset link")}</Button></div>
        </form>
        <p style={{ marginTop: "16px" }}>{link(t("recBack", "Back to log in"), onLogin, "/login")}</p>
      </Wrap>
    );
  }

  /* ---------- Nouveau mot de passe ---------- */
  if (!token || step === "expired") return expired;
  if (step === "done")
    return (
      <Wrap title={t("recDoneTitle", "Password updated")}>
        <Subtitle>{t("recDoneText", "You can now log in with your new password.")}</Subtitle>
        <div style={{ marginTop: "16px" }}><Button onClick={onLogin}>{t("regLogin", "Go to log in")}</Button></div>
      </Wrap>
    );

  const submitReset = async (event) => {
    event.preventDefault();
    setFormError("");
    const found = {};
    if (!Object.values(rules).every((r) => r(password))) found.password = t("regErrPasswordRules", "Your password doesn’t meet all the rules.");
    if (password !== confirm) found.confirm = t("recMismatch", "The passwords don’t match.");
    setErrors(found);
    if (Object.keys(found).length) return;
    setLoading(true);
    try {
      const r = await api("/auth/reset-password", { method: "POST", body: { token, password } });
      if (r.ok) setStep("done");
      else if ([400, 401, 410].includes(r.status)) setStep("expired");   // lien expiré ou invalide
      else setFormError(t("recResetFailed", "We couldn’t update your password. Please try again."));
    } catch {
      setFormError(networkMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrap title={t("recNewTitle", "Choose a new password")}>
      {formError && <p role="alert" style={errorStyle}>{formError}</p>}
      <form onSubmit={submitReset} noValidate style={{ display: "grid", gap: "16px" }}>
        <Field label={t("recNewPassword", "New password")} error={errors.password}>
          <input style={inputStyle} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px" }}>
          {[["len", t("regRuleLen", "At least 8 characters")], ["upper", t("regRuleUpper", "One uppercase letter")], ["num", t("regRuleNum", "One number")]].map(([k, label]) => (
            <li key={k} style={{ color: rules[k](password) ? "#059669" : "var(--muted)" }}>{rules[k](password) ? "● " : "○ "}{label}</li>
          ))}
        </ul>
        <Field label={t("recConfirmPassword", "Confirm password")} error={errors.confirm}>
          <input style={inputStyle} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        <div><Button type="submit" disabled={loading}>{loading ? t("loginLoading", "Please wait…") : t("recSave", "Save new password")}</Button></div>
      </form>
    </Wrap>
  );
}

export default AccountRecovery;
