import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../services/AppContext";
import { authService } from "../services/authService";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function AuthShell({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
        padding: "24px 16px",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "20px", right: "24px" }}>
        <LanguageSwitcher />
      </div>

      {/* Brand Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            backgroundColor: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 4px 10px rgba(179,55,83,0.3)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          </svg>
        </div>
        <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.5px" }}>
          CertiX
        </span>
      </div>

      {children}
    </div>
  );
}

const inputBaseStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  border: "1px solid var(--border-light)",
  backgroundColor: "var(--surface)",
  color: "var(--text-main)",
  fontSize: "14px",
  outline: "none",
};

export function LoginPage() {
  const { t } = useTranslation();
  const { login, setActiveTab } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, "student", rememberMe);
    } catch (err) {
      setError(
        err.message === "INVALID_CREDENTIALS"
          ? t("auth.invalidCredentials")
          : err.message || t("auth.invalidCredentials")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError("");
    setLoading(true);
    try {
      const demoEmail = role === "admin" ? "admin@sesame.com.tn" : "amira@sesame.com.tn";
      const demoPass = "Password123!";
      await login(demoEmail, demoPass, role, true);
    } catch {
      setError(t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div
        className="cx-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "34px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
          {t("auth.loginTitle")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "22px" }}>
          {t("auth.loginSubtitle")}
        </p>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--badge-rejected-bg)",
              color: "var(--badge-rejected-text)",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "18px",
              border: "1px solid var(--badge-rejected-border)",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputBaseStyle}
            />
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {t("auth.password")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputBaseStyle, paddingRight: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", display: "flex" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", fontSize: "13px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--primary)" }}
              />
              {t("auth.rememberMe")}
            </label>
            <button
              type="button"
              onClick={() => setActiveTab("forgot-password")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "13px", fontWeight: "500" }}
            >
              {t("auth.forgotPassword")}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "14.5px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            {loading ? t("auth.loggingIn") : t("auth.loginBtn")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => handleQuickDemo("student")}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "var(--surface)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-light)",
            fontSize: "13.5px",
            fontWeight: "500",
            marginBottom: "8px",
          }}
        >
          {t("auth.sampleMember")}
        </button>

        <button
          type="button"
          onClick={() => handleQuickDemo("admin")}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "var(--surface)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-light)",
            fontSize: "13.5px",
            fontWeight: "500",
            marginBottom: "18px",
          }}
        >
          {t("auth.sampleAdmin")}
        </button>

        <div
          style={{
            backgroundColor: "var(--surface-muted)",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            fontSize: "12px",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            marginBottom: "18px",
          }}
        >
          {t("auth.demoNotice")}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
          <span style={{ color: "var(--text-muted)" }}>
            {t("auth.noAccount")}{" "}
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "600" }}
            >
              {t("auth.signUpLink")}
            </button>
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemo("student")}
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "500" }}
          >
            {t("auth.exploreDemo")}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { register, setActiveTab } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studyProgram, setStudyProgram] = useState("Génie Logiciel");
  const [level, setLevel] = useState("3ème année");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    const errs = {};

    if (!fullName.trim()) errs.fullName = t("requiredFields");
    if (!email.trim()) errs.email = t("requiredFields");
    const strongPass = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!strongPass) errs.password = t("auth.passwordWeak");
    if (password !== confirmPassword) errs.confirmPassword = t("auth.passwordsMismatch");
    if (!agreed) errs.agreed = t("auth.acceptTermsError");

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      await register({ fullName, email, password, studyProgram, level });
      setRegisteredSuccess(true);
    } catch (err) {
      if (err.fields && Object.keys(err.fields).length > 0) {
        setFieldErrors(err.fields);
      }
      setGeneralError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (registeredSuccess) {
    return (
      <AuthShell>
        <div className="cx-card" style={{ width: "100%", maxWidth: "460px", padding: "36px", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--badge-verified-bg)",
              color: "var(--badge-verified-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckCircle2 size={28} />
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", marginBottom: "10px" }}>
            {t("auth.registerSuccessTitle")}
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "24px" }}>
            {t("auth.registerSuccessMsg")}
          </p>
          <button
            onClick={() => setActiveTab("passport")}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "14.5px",
              fontWeight: "600",
            }}
          >
            {t("auth.goToPassport")}
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="cx-card" style={{ width: "100%", maxWidth: "480px", padding: "34px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
          {t("auth.registerTitle")}
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
          {t("auth.registerSubtitle")}
        </p>

        <div
          style={{
            backgroundColor: "var(--surface-muted)",
            padding: "11px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
            fontSize: "12px",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            marginBottom: "18px",
          }}
        >
          {t("auth.registerNotice")}
        </div>

        {generalError && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "var(--badge-rejected-bg)",
              color: "var(--badge-rejected-text)",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            <AlertCircle size={18} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("auth.fullName")}
            </label>
            <input
              type="text"
              required
              placeholder={t("auth.fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputBaseStyle}
            />
            {fieldErrors.fullName && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{fieldErrors.fullName}</span>}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              placeholder={t("auth.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputBaseStyle}
            />
            {fieldErrors.email && <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{fieldErrors.email}</span>}
          </div>

          <div className="cx-grid-2" style={{ gap: "12px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("auth.studyProgram")}
              </label>
              <select
                value={studyProgram}
                onChange={(e) => setStudyProgram(e.target.value)}
                style={inputBaseStyle}
              >
                <option value="Génie Logiciel">Génie Logiciel</option>
                <option value="Computer Science BSc">Computer Science BSc</option>
                <option value="Data Science & IA">Data Science & IA</option>
                <option value="Cybersécurité">Cybersécurité</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
                {t("auth.level")}
              </label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inputBaseStyle}>
                <option value="1ère année">1ère année</option>
                <option value="2ème année">2ème année</option>
                <option value="3ème année">3ème année</option>
                <option value="Master 1">Master 1</option>
                <option value="Master 2">Master 2</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("auth.password")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputBaseStyle, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span style={{ fontSize: "11px", color: fieldErrors.password ? "var(--badge-rejected-text)" : "var(--text-muted)", marginTop: "4px", display: "block" }}>
              {fieldErrors.password || t("auth.passwordHint")}
            </span>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "5px" }}>
              {t("auth.confirmPassword")}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ ...inputBaseStyle, paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)" }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)" }}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "18px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ accentColor: "var(--primary)", marginTop: "3px" }}
            />
            <span>{t("auth.acceptTerms")}</span>
          </label>
          {fieldErrors.agreed && (
            <div style={{ fontSize: "11.5px", color: "var(--badge-rejected-text)", marginBottom: "12px" }}>{fieldErrors.agreed}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "14.5px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            {loading ? t("auth.creating") : t("auth.createAccountBtn")}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
          {t("auth.hasAccount")}{" "}
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: "600" }}
          >
            {t("auth.logInLink")}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { setActiveTab, showNotification } = useApp();
  const [step, setStep] = useState("request"); // "request" | "sent" | "new-password"
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("valid-token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setStep("sent");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
      setError(t("auth.passwordWeak"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    setLoading(true);
    try {
      await authService.confirmPasswordReset({ token: resetToken, newPassword });
      showNotification(t("auth.newPasswordBtn"));
      setActiveTab("login");
    } catch (err) {
      setError(
        err.message === "INVALID_RESET_TOKEN" ? t("auth.resetExpiredError") : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="cx-card" style={{ width: "100%", maxWidth: "440px", padding: "34px" }}>
        {step === "request" && (
          <>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              {t("auth.resetTitle")}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "22px", lineHeight: "1.5" }}>
              {t("auth.resetSubtitle")}
            </p>
            {error && (
              <div style={{ backgroundColor: "var(--badge-rejected-bg)", color: "var(--badge-rejected-text)", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleRequestSubmit}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputBaseStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--primary)", color: "#ffffff", border: "none", fontSize: "14.5px", fontWeight: "600", marginBottom: "14px" }}
              >
                {t("auth.sendResetBtn")}
              </button>

              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "13px" }}
                >
                  {t("auth.backToLogin")}
                </button>
              </div>
            </form>
          </>
        )}

        {step === "sent" && (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "var(--badge-verified-bg)", color: "var(--badge-verified-text)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "var(--text-main)", marginBottom: "8px" }}>
              {t("auth.resetSentTitle")}
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "22px" }}>
              {t("auth.resetSentMsg")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStep("new-password")}
                style={{ padding: "10px 18px", borderRadius: "10px", backgroundColor: "var(--surface-muted)", color: "var(--primary)", border: "1px solid var(--border-light)", fontSize: "13px", fontWeight: "600" }}
              >
                {t("auth.simulateNewPassword")}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                style={{ padding: "11px 22px", borderRadius: "10px", backgroundColor: "var(--primary)", color: "#ffffff", border: "none", fontSize: "14px", fontWeight: "600" }}
              >
                {t("auth.backToLogin")}
              </button>
            </div>
          </div>
        )}

        {step === "new-password" && (
          <>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px" }}>
              {t("auth.newPasswordTitle")}
            </h1>
            {error && (
              <div style={{ backgroundColor: "var(--badge-rejected-bg)", color: "var(--badge-rejected-text)", padding: "10px 12px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px" }}>
                {error}
              </div>
            )}
            <form onSubmit={handleConfirmSubmit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputBaseStyle}
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  {t("auth.passwordHint")}
                </span>
              </div>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  {t("auth.confirmPassword")}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputBaseStyle}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", backgroundColor: "var(--primary)", color: "#ffffff", border: "none", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}
              >
                {t("auth.newPasswordBtn")}
              </button>
              <button
                type="button"
                onClick={() => setResetToken(resetToken === "expired" ? "valid-token" : "expired")}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "11.5px" }}
              >
                Token test: {resetToken}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthShell>
  );
}
