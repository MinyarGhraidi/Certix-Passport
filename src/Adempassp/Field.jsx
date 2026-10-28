// Style des champs, identique à inputStyle de App.jsx
export const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: "15px",
};
export const errorStyle = { color: "#dc2626", fontSize: "14px", marginTop: "6px" };
export const pageStyle = { minHeight: "100vh", padding: "32px 20px", background: "var(--background)", color: "var(--text)" };

// Label + champ + message d'erreur
export function Field({ label, error, children }) {
  return (
    <label>
      {label}
      {children}
      {error && <p role="alert" style={errorStyle}>{error}</p>}
    </label>
  );
}
