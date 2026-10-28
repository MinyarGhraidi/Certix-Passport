import { useState } from "react";
import { Link2 } from "lucide-react";
import { TextField, SelectField } from "./Field.jsx";
import { saveLinks } from "../../services/profileApi.js";
import { fieldMessage } from "../../services/messages.js";
import { LINK_TYPES, cleanLinks, validateLinks } from "../../../shared/validation.js";

// URL proposée par défaut selon le type choisi
const URL_PREFIX = {
  LinkedIn: "https://www.linkedin.com/",
  GitHub: "https://github.com/",
  Portfolio: "https://",
  Other: "https://",
};

const sameLinks = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function LinksCard({ profile, onProfileChange }) {
  const [links, setLinks] = useState(profile.links);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });

  const dirty = !sameLinks(links, profile.links);
  const saving = status.type === "saving";

  const touch = (id, field) => {
    setErrors((previous) => ({ ...previous, [`${id}.${field}`]: undefined, links: undefined }));
    setStatus({ type: "", text: "" });
  };

  const update = (id, changes) =>
    setLinks((previous) => previous.map((link) => (link.id === id ? { ...link, ...changes } : link)));

  const changeType = (link) => (event) => {
    const type = event.target.value;
    // Met à jour le label et l'URL seulement s'ils n'ont pas été personnalisés
    update(link.id, {
      type,
      label: !link.label || link.label === link.type ? type : link.label,
      url: !link.url || link.url === URL_PREFIX[link.type] ? URL_PREFIX[type] : link.url,
    });
    touch(link.id, "type");
  };

  const addLink = () => {
    setLinks((previous) => [
      ...previous,
      { id: crypto.randomUUID(), type: "Other", label: "", url: URL_PREFIX.Other },
    ]);
    setStatus({ type: "", text: "" });
  };

  const removeLink = (id) => {
    setLinks((previous) => previous.filter((link) => link.id !== id));
    setStatus({ type: "", text: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    const data = cleanLinks(links);
    const found = validateLinks(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ type: "error", text: found.links ? fieldMessage(found.links) : "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "saving", text: "" });
    try {
      const fresh = await saveLinks(data);
      onProfileChange(fresh);
      setLinks(fresh.links);
      setStatus({ type: "saved", text: "Links saved." });
    } catch (err) {
      setErrors(err.fields ?? {});
      setStatus({ type: "error", text: "Could not save your links. Please try again." });
    }
  };

  const cancel = () => {
    setLinks(profile.links);
    setErrors({});
    setStatus({ type: "", text: "" });
  };

  const err = (id, field) => fieldMessage(errors[`${id}.${field}`]);

  return (
    <section className="st-card" aria-labelledby="st-links-title">
      <h2 id="st-links-title" className="st-card-title">Links</h2>
      <p className="st-card-subtitle">Links that represent your professional journey.</p>

      <form onSubmit={submit} noValidate>
        {links.map((link) => (
          <div className="st-link-item" key={link.id}>
            <SelectField label="Type" value={link.type} options={LINK_TYPES}
              onChange={changeType(link)} error={err(link.id, "type")} />
            <TextField label="Label" value={link.label} error={err(link.id, "label")}
              onChange={(event) => { update(link.id, { label: event.target.value }); touch(link.id, "label"); }} />
            <TextField
              className="st-span-2"
              label="URL"
              labelIcon={<Link2 size={14} aria-hidden="true" />}
              value={link.url}
              error={err(link.id, "url")}
              onChange={(event) => { update(link.id, { url: event.target.value }); touch(link.id, "url"); }}
              after={
                <button type="button" className="st-btn" onClick={() => removeLink(link.id)}>
                  Remove
                </button>
              }
            />
          </div>
        ))}

        <button type="button" className="st-btn st-add-link" onClick={addLink}>
          Add new link
        </button>

        <div className="st-actions">
          <button type="submit" className="st-btn st-btn-primary" disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className="st-btn" disabled={!dirty || saving} onClick={cancel}>
            Cancel
          </button>
          {status.text && (
            <p className={status.type === "saved" ? "st-success" : "st-error"}
              role={status.type === "saved" ? "status" : "alert"}>
              {status.text}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default LinksCard;
