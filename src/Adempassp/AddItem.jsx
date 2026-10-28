import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Title from "../components/ui/Title.jsx";
import Subtitle from "../components/ui/Subtitle.jsx";
import { Field, inputStyle, errorStyle, pageStyle } from "../components/Field.jsx";
import { CATEGORIES, StatusBadge } from "../components/passportParts.jsx";
import { upload } from "../api.js";

/* FCP-43 : Add a manual item
   Props : onDone() -> retour à la passport ; */
const MAX_SIZE = 5 * 1024 * 1024;   // 5 Mo
const TYPES = ["application/pdf", "image/png", "image/jpeg"];

function AddItem({ onDone }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ category: "", title: "", organization: "", startDate: "", endDate: "", description: "" });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(null);   // null = pas d'envoi, sinon 0..100
  const [created, setCreated] = useState(null);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const required = t("addRequired", "This field is required.");

  const validate = () => {
    const f = {};
    ["category", "title", "organization", "startDate"].forEach((k) => { if (!String(form[k]).trim()) f[k] = required; });
    if (form.endDate && form.startDate && form.endDate < form.startDate) f.endDate = t("addErrDates", "The end date can’t be before the start date.");
    if (file && !TYPES.includes(file.type)) f.file = t("addErrType", "Use a PDF, PNG or JPG file.");
    else if (file && file.size > MAX_SIZE) f.file = t("addErrSize", "The file must be 5 MB or less.");
    return f;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("evidence", file);

    setProgress(0);
    const result = await upload("/passport/items", data, setProgress);
    if (result.ok) {
      setCreated(result.body.item || { status: "pending" });   // statut renvoyé par le backend (Pending)
      return;
    }
    const serverErrors = result.body?.errors;
    if (serverErrors) setErrors(serverErrors);
    else setFormError(t("addFailed", "We couldn’t submit your item. Check your connection and try again."));
    setProgress(null);
  };

  if (created)
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: "560px", margin: "auto" }}>
          <Card title={t("addSentTitle", "Item submitted")}>
            <p><StatusBadge status={created.status} /></p>
            <Subtitle>{t("addSentText", "Your item is waiting for review. You’ll see its status change on your passport once an administrator has reviewed it.")}</Subtitle>
            <div style={{ marginTop: "16px" }}><Button onClick={onDone}>{t("addBack", "Back to my passport")}</Button></div>
          </Card>
        </div>
      </main>
    );

  const sending = progress !== null;

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: "560px", margin: "auto" }}>
        <Title level={1}>{t("addTitle", "Add a record")}</Title>
        <div style={{ marginTop: "20px" }}>
          <Card title={t("addCardTitle", "Item details")}>
            {formError && <p role="alert" style={errorStyle}>{formError}</p>}
            <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: "16px" }}>
              <Field label={`${t("category", "Category")} *`} error={errors.category}>
                <select style={inputStyle} value={form.category} onChange={set("category")} disabled={sending}>
                  <option value="">{t("regSelect", "Select…")}</option>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{t(c.key, c.label)}</option>)}
                </select>
              </Field>
              <Field label={`${t("addItemTitle", "Title")} *`} error={errors.title}>
                <input style={inputStyle} type="text" value={form.title} onChange={set("title")} disabled={sending} />
              </Field>
              <Field label={`${t("addOrg", "Organization")} *`} error={errors.organization}>
                <input style={inputStyle} type="text" value={form.organization} onChange={set("organization")} disabled={sending} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <Field label={`${t("addStart", "Start date")} *`} error={errors.startDate}>
                  <input style={inputStyle} type="date" value={form.startDate} onChange={set("startDate")} disabled={sending} />
                </Field>
                <Field label={t("addEnd", "End date")} error={errors.endDate}>
                  <input style={inputStyle} type="date" value={form.endDate} onChange={set("endDate")} disabled={sending} />
                </Field>
              </div>
              <Field label={t("addDescription", "Description")} error={errors.description}>
                <textarea style={{ ...inputStyle, minHeight: "90px" }} value={form.description} onChange={set("description")} disabled={sending} />
              </Field>
              <Field label={t("addEvidence", "Evidence (PDF, PNG or JPG, 5 MB max)")} error={errors.file}>
                <input style={inputStyle} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={sending} />
              </Field>

              {sending && (
                <div role="status" aria-live="polite">
                  <div style={{ height: "10px", background: "var(--secondary)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "var(--primary)", transition: "width 0.2s" }} />
                  </div>
                  <p style={{ color: "var(--muted)", marginTop: "6px" }}>
                    {progress < 100 ? t("addUploading", "Uploading… {{n}}%", { n: progress }) : t("addSubmitting", "Submitting your item…")}
                  </p>
                </div>
              )}

              <div>
                <Button type="submit" disabled={sending}>{t("addSubmit", "Submit for review")}</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default AddItem;
