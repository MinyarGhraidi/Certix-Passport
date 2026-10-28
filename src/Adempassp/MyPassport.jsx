import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Title from "../components/ui/Title.jsx";
import Subtitle from "../components/ui/Subtitle.jsx";
import { Field, inputStyle, errorStyle, pageStyle } from "../components/Field.jsx";
import { CATEGORIES, StatusBadge, useFormatDate, useCategoryLabel } from "../components/passportParts.jsx";
import { api } from "../api.js";

/* FCP-41 : voir ma passport   FCP-42 : filtres + statuts
   FCP-44 : renvoyer un item rejeté   FCP-45 : visibilité   FCP-46 : aperçu public
   Props : onAdd() -> ouvre la page AddItem */
const FILTER_KEY = "certix-passport-filters";
const yearOf = (item) => (item.endDate || item.startDate || "").slice(0, 4);

function loadFilters() {
  try { return JSON.parse(sessionStorage.getItem(FILTER_KEY)) || { category: "", year: "" }; }
  catch { return { category: "", year: "" }; }
}

function MyPassport({ onAdd }) {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const categoryLabel = useCategoryLabel();

  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");   // loading | error | ready
  const [filters, setFilters] = useState(loadFilters);
  const [visBusy, setVisBusy] = useState({});
  const [visError, setVisError] = useState({});
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);    // null | { state, sharingEnabled, items }

  const load = useCallback(async () => {
    setState("loading");
    try {
      const r = await api("/passport/items");
      if (!r.ok) throw new Error("load");
      setItems(r.body.items || []);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // les filtres sont conservés pendant la navigation (sessionStorage)
  const changeFilter = (field) => (e) => {
    const next = { ...filters, [field]: e.target.value };
    setFilters(next);
    try { sessionStorage.setItem(FILTER_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const years = [...new Set(items.map(yearOf).filter(Boolean))].toSorted((a, b) => b.localeCompare(a));
  const shown = items.filter((i) => (!filters.category || i.category === filters.category) && (!filters.year || yearOf(i) === filters.year));

  /* ---------- FCP-45 : visibilité (l'état change seulement après confirmation du backend) ---------- */
  const toggleVisibility = async (item) => {
    const next = item.visibility === "public" ? "private" : "public";
    setVisBusy((p) => ({ ...p, [item.id]: true }));
    setVisError((p) => ({ ...p, [item.id]: "" }));
    try {
      const r = await api(`/passport/items/${item.id}/visibility`, { method: "PATCH", body: { visibility: next } });
      if (!r.ok) throw new Error("visibility");
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, visibility: next } : i)));
    } catch {
      // échec : on garde l'ancien état et on le dit clairement
      setVisError((p) => ({ ...p, [item.id]: t("visError", "We couldn’t change the visibility. It was left unchanged.") }));
    } finally {
      setVisBusy((p) => ({ ...p, [item.id]: false }));
    }
  };

  /* ---------- FCP-46 : aperçu public ---------- */
  const openPreview = async () => {
    setPreview({ state: "loading", items: [] });
    try {
      const r = await api("/passport/public");
      if (!r.ok) throw new Error("preview");
      setPreview({ state: "ready", sharingEnabled: r.body.sharingEnabled !== false, items: r.body.items || [] });
    } catch {
      setPreview({ state: "error", items: [] });
    }
  };

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "850px", margin: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Title level={1}>{t("ppTitle", "My digital passport")}</Title>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={openPreview}>{t("ppPreview", "Preview public passport")}</Button>
            <Button onClick={onAdd}>{t("ppAdd", "Add record")}</Button>
          </div>
        </div>
        <Subtitle>{t("ppStatusNote", "Statuses are set by the CertiX team after review, not by this page.")}</Subtitle>

        {/* ----- Aperçu public (FCP-46) ----- */}
        {preview && (
          <div style={{ marginTop: "20px" }}>
            <Card title={t("ppPublicTitle", "Public view")}>
              {preview.state === "loading" && <p>{t("ppLoading", "Loading…")}</p>}
              {preview.state === "error" && <p role="alert" style={errorStyle}>{t("ppPublicError", "We couldn’t load the preview. Please try again.")}</p>}
              {preview.state === "ready" && !preview.sharingEnabled && (
                <p>{t("ppUnavailable", "Your public passport is unavailable because sharing is turned off.")}</p>
              )}
              {preview.state === "ready" && preview.sharingEnabled && (preview.items.length === 0
                ? <p style={{ color: "var(--muted)" }}>{t("ppPublicEmpty", "Nothing is public yet. Make a verified item public to see it here.")}</p>
                : <div style={{ display: "grid", gap: "10px" }}>
                    {preview.items.map((i) => (
                      <div key={i.id}>
                        <strong>{i.title}</strong> <StatusBadge status={i.status} />
                        <div style={{ color: "var(--muted)" }}>{i.organization} · {categoryLabel(i.category)} · {formatDate(i.startDate)}</div>
                      </div>
                    ))}
                  </div>)}
              <div style={{ marginTop: "14px" }}><Button variant="secondary" onClick={() => setPreview(null)}>{t("ppClose", "Close preview")}</Button></div>
            </Card>
          </div>
        )}

        {/* ----- Filtres (FCP-42) ----- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", margin: "24px 0 8px" }}>
          <Field label={t("category", "Category")}>
            <select style={inputStyle} value={filters.category} onChange={changeFilter("category")}>
              <option value="">{t("ppAll", "All")}</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{t(c.key, c.label)}</option>)}
            </select>
          </Field>
          <Field label={t("ppYear", "Year")}>
            <select style={inputStyle} value={filters.year} onChange={changeFilter("year")}>
              <option value="">{t("ppAll", "All")}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </Field>
        </div>

        {/* ----- Liste : chargement / erreur / vide ----- */}
        {state === "loading" && <p role="status" style={{ marginTop: "20px" }}>{t("ppLoading", "Loading…")}</p>}
        {state === "error" && (
          <div style={{ marginTop: "20px" }}>
            <p role="alert" style={errorStyle}>{t("ppError", "We couldn’t load your passport.")}</p>
            <Button onClick={load}>{t("recRetry", "Try again")}</Button>
          </div>
        )}
        {state === "ready" && items.length === 0 && (
          <p style={{ color: "var(--muted)", marginTop: "20px" }}>{t("ppEmpty", "Your passport is empty. Add your first record to get started.")}</p>
        )}
        {state === "ready" && items.length > 0 && shown.length === 0 && (
          <p style={{ color: "var(--muted)", marginTop: "20px" }}>{t("ppNoMatch", "No items match these filters.")}</p>
        )}

        <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
          {state === "ready" && shown.map((item) => (
            <article key={item.id} style={{ padding: "18px", border: "1px solid var(--secondary)", borderRadius: "12px", background: "var(--surface)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p style={{ color: "var(--muted)", margin: "6px 0" }}>{item.organization} · {categoryLabel(item.category)}</p>
              <p style={{ color: "var(--muted)", margin: "0 0 10px" }}>
                {formatDate(item.startDate)}{item.endDate && item.endDate !== item.startDate ? ` → ${formatDate(item.endDate)}` : ""}
              </p>

              {/* Motif de rejet : visible ici car c'est la vue privée (FCP-42 / FCP-44) */}
              {item.status === "rejected" && (
                <div role="note" style={{ padding: "10px 12px", borderRadius: "10px", background: "#fee2e2", color: "#7f1d1d", marginBottom: "10px" }}>
                  <strong>{t("ppReason", "Rejection reason")}:</strong> {item.rejectionReason || t("ppNoReason", "No reason was given.")}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                {/* Contrôle de visibilité (FCP-45) : seulement pour les items éligibles (vérifiés) */}
                <Button variant="secondary" disabled={item.status !== "verified" || visBusy[item.id]}
                  aria-pressed={item.visibility === "public"} onClick={() => toggleVisibility(item)}>
                  {visBusy[item.id] ? t("loginLoading", "Please wait…")
                    : item.visibility === "public" ? t("ppPublic", "Public · make private") : t("ppPrivate", "Private · make public")}
                </Button>
                {item.status !== "verified" && <span style={{ color: "var(--muted)", fontSize: "14px" }}>{t("ppOnlyVerified", "Only verified items can be made public.")}</span>}
                {item.status === "rejected" && editing !== item.id && (
                  <Button onClick={() => setEditing(item.id)}>{t("ppEdit", "Edit and resubmit")}</Button>
                )}
              </div>
              {visError[item.id] && <p role="alert" style={errorStyle}>{visError[item.id]}</p>}

              {editing === item.id && (
                <ResubmitForm item={item} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ---------- FCP-44 : modifier et renvoyer ---------- */
function ResubmitForm({ item, onCancel, onSaved }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ title: item.title, organization: item.organization, description: item.description || "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    const found = {};
    if (!form.title.trim()) found.title = t("addRequired", "This field is required.");
    if (!form.organization.trim()) found.organization = t("addRequired", "This field is required.");
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setFormError("");
    try {
      const r = await api(`/passport/items/${item.id}`, { method: "PUT", body: form });
      if (r.ok) return onSaved();            // la liste est rechargée : le statut vient du backend
      if (r.body?.errors) setErrors(r.body.errors);
      else throw new Error("resubmit");
    } catch {
      setFormError(t("ppResubmitFailed", "We couldn’t resubmit this item. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate style={{ display: "grid", gap: "12px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--secondary)" }}>
      <p style={{ color: "var(--muted)", margin: 0 }}>
        {t("ppRevalidation", "Changing an approved item may require it to be reviewed again.")}
      </p>
      {formError && <p role="alert" style={errorStyle}>{formError}</p>}
      <Field label={t("addItemTitle", "Title")} error={errors.title}>
        <input style={inputStyle} value={form.title} onChange={set("title")} disabled={saving} />
      </Field>
      <Field label={t("addOrg", "Organization")} error={errors.organization}>
        <input style={inputStyle} value={form.organization} onChange={set("organization")} disabled={saving} />
      </Field>
      <Field label={t("addDescription", "Description")}>
        <textarea style={{ ...inputStyle, minHeight: "80px" }} value={form.description} onChange={set("description")} disabled={saving} />
      </Field>
      <div style={{ display: "flex", gap: "10px" }}>
        <Button type="submit" disabled={saving}>{saving ? t("loginLoading", "Please wait…") : t("ppResubmit", "Resubmit for review")}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>{t("ppCancel", "Cancel")}</Button>
      </div>
    </form>
  );
}

export default MyPassport;
