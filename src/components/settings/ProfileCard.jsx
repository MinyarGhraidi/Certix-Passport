import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Avatar from "./Avatar.jsx";
import { initialsOf } from "./initials.js";
import { TextField, SelectField, TextAreaField } from "./Field.jsx";
import { useImageUpload } from "../../hooks/useImageUpload.js";
import { saveProfile } from "../../services/profileApi.js";
import { fieldMessage, uploadMessage } from "../../services/messages.js";
import {
  LEVELS,
  BIO_MAX,
  PROFILE_FIELDS,
  cleanProfile,
  validateProfile,
} from "../../../shared/validation.js";

const pickFields = (profile) =>
  Object.fromEntries(PROFILE_FIELDS.map((field) => [field, profile[field] ?? ""]));

function UploadStatus({ label, upload }) {
  return (
    <>
      {upload.progress !== null && (
        <div className="st-progress">
          <div
            className="st-progress-bar"
            role="progressbar"
            aria-label={`${label} upload`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={upload.progress}
          >
            <div style={{ width: `${upload.progress}%` }} />
          </div>
          <span>
            Uploading {label}… {upload.progress}%
          </span>
        </div>
      )}
      {upload.error && (
        <p className="st-error" role="alert">
          {uploadMessage(upload.error)}
        </p>
      )}
    </>
  );
}

function ProfileCard({ profile, onProfileChange }) {
  const [draft, setDraft] = useState(() => pickFields(profile));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" }); // saving | saved | error

  const avatar = useImageUpload("avatar", onProfileChange);
  const cover = useImageUpload("cover", onProfileChange);
  const avatarInput = useRef(null);
  const coverInput = useRef(null);

  const saved = pickFields(profile);
  const dirty = PROFILE_FIELDS.some((field) => draft[field] !== saved[field]);
  const saving = status.type === "saving";

  const change = (field) => (event) => {
    const value = event.target.value;
    setDraft((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setStatus({ type: "", text: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    const data = cleanProfile(draft);
    const found = validateProfile(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "saving", text: "" });
    try {
      const fresh = await saveProfile(data);
      onProfileChange(fresh); // rafraîchit tout (en-tête compris)
      setDraft(pickFields(fresh));
      setStatus({ type: "saved", text: "Profile saved." });
    } catch (err) {
      setErrors(err.fields ?? {});
      setStatus({
        type: "error",
        text:
          err.code === "validation"
            ? "Please fix the highlighted fields."
            : "Could not save your profile. Please try again.",
      });
    }
  };

  const cancel = () => {
    setDraft(saved);
    setErrors({});
    setStatus({ type: "", text: "" });
  };

  const pick = (upload) => (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // permet de re-choisir le même fichier
    if (file) upload.start(file);
  };

  const coverSrc = cover.preview || profile.coverUrl;
  const err = (field) => fieldMessage(errors[field]);

  return (
    <section className="st-card" aria-labelledby="st-profile-title">
      <h2 id="st-profile-title" className="st-card-title">Profile</h2>
      <p className="st-card-subtitle">Manage your photo and personal details.</p>

      <form onSubmit={submit} noValidate>
        <div
          className="st-cover"
          style={coverSrc ? { backgroundImage: `url("${coverSrc}")` } : undefined}
        />

        <div className="st-avatar-row">
          <Avatar
            className="st-avatar-large"
            src={avatar.preview || profile.avatarUrl}
            initials={initialsOf(profile)}
            alt="Profile photo"
          />
          <div className="st-image-actions">
            <button type="button" className="st-btn" disabled={avatar.busy}
              onClick={() => avatarInput.current?.click()}>
              <Upload size={18} /> Update avatar
            </button>
            <button type="button" className="st-btn" disabled={avatar.busy}
              onClick={() => profile.avatarUrl && avatar.remove()}>
              Remove avatar
            </button>
            <button type="button" className="st-btn" disabled={cover.busy}
              onClick={() => coverInput.current?.click()}>
              <Upload size={18} /> Update cover
            </button>
            <button type="button" className="st-btn" disabled={cover.busy}
              onClick={() => profile.coverUrl && cover.remove()}>
              Remove cover
            </button>
          </div>
        </div>

        <input ref={avatarInput} type="file" accept="image/png,image/jpeg" className="st-sr-only"
          aria-label="Avatar image (PNG or JPG, 10 MB max)" tabIndex={-1} onChange={pick(avatar)} />
        <input ref={coverInput} type="file" accept="image/png,image/jpeg" className="st-sr-only"
          aria-label="Cover image (PNG or JPG, 10 MB max)" tabIndex={-1} onChange={pick(cover)} />

        <UploadStatus label="avatar" upload={avatar} />
        <UploadStatus label="cover" upload={cover} />

        <div className="st-grid">
          <TextField label="First name" value={draft.firstName} onChange={change("firstName")} error={err("firstName")} />
          <TextField label="Last name" value={draft.lastName} onChange={change("lastName")} error={err("lastName")} />
          <TextField label="Username" value={draft.username} onChange={change("username")} error={err("username")} />
          <TextField label="Website" value={draft.website} onChange={change("website")} error={err("website")} placeholder="https://example.com" />
          <TextField label="University" value={draft.university} onChange={change("university")} error={err("university")} />
          <TextField label="Club" value={draft.club} onChange={change("club")} error={err("club")} />
          <TextField label="Study program" value={draft.program} onChange={change("program")} error={err("program")} />
          <SelectField label="Year" value={draft.year} onChange={change("year")} error={err("year")}
            options={LEVELS} placeholder="Choose a level" />
          <TextAreaField className="st-span-2" label="Short bio" value={draft.bio}
            onChange={change("bio")} error={err("bio")} maxLength={BIO_MAX} />
        </div>

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

export default ProfileCard;
