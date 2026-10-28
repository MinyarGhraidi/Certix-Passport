// Règles de validation PARTAGÉES : importées par React (src/) ET par Node (server/).
// Une seule source de vérité => le front et le back ne peuvent pas se contredire.

export const LEVELS = [
  "LIM 1", "LIM 2", "LIM 3",
  "LBIS 1", "LBIS 2", "LBIS 3",
  "LGLSI 1", "LGLSI 2", "LGLSI 3",
  "LM 1", "LM 2", "LM 3",
  "MSCM 1", "MSCM 2",
  "MTD-ERP 1", "MTD-ERP 2",
  "MMDA 1", "MMDA 2",
  "ING 1", "ING 2", "ING 3",
];

export const LINK_TYPES = ["LinkedIn", "GitHub", "Portfolio", "Other"];
export const PROFILE_FIELDS = [
  "firstName", "lastName", "username", "website",
  "university", "club", "program", "year", "bio",
];

export const BIO_MAX = 300;
export const MAX_LINKS = 10;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const IMAGE_TYPES = ["image/png", "image/jpeg"];

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,30}$/;
const HOSTS = {
  LinkedIn: ["linkedin.com", "linkedinHost"],
  GitHub: ["github.com", "githubHost"],
};

// ---------- Nettoyage ----------

export function normalizeUrl(value) {
  const v = String(value ?? "").trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function cleanProfile(input) {
  const out = {};
  for (const field of PROFILE_FIELDS) out[field] = String(input?.[field] ?? "").trim();
  out.website = normalizeUrl(out.website);
  return out;
}

export function cleanLinks(input) {
  if (!Array.isArray(input)) return [];
  return input.map((link) => ({
    id: String(link?.id ?? "").trim().slice(0, 64),
    type: String(link?.type ?? "").trim(),
    label: String(link?.label ?? "").trim(),
    url: normalizeUrl(link?.url),
  }));
}

// ---------- Validation ----------
// Chaque fonction retourne un objet { champ: "codeErreur" } (vide = valide).

function urlError(value, host) {
  try {
    const url = new URL(normalizeUrl(value));
    if (!url.hostname.includes(".")) return "urlInvalid";
    if (host) {
      const h = url.hostname.toLowerCase();
      if (h !== host[0] && !h.endsWith(`.${host[0]}`)) return host[1];
    }
    return null;
  } catch {
    return "urlInvalid";
  }
}

export function validateProfile(p) {
  const e = {};
  const text = (field, max) => {
    if (!p[field]) e[field] = "required";
    else if (p[field].length > max) e[field] = "tooLong";
  };
  text("firstName", 50);
  text("lastName", 50);
  text("university", 100);
  text("club", 100);
  text("program", 100);

  if (!p.username) e.username = "required";
  else if (!USERNAME_RE.test(p.username)) e.username = "usernameFormat";

  if (p.website) {
    const err = urlError(p.website);
    if (err) e.website = err;
    else if (p.website.length > 200) e.website = "tooLong";
  }

  if (!p.year) e.year = "required";
  else if (!LEVELS.includes(p.year)) e.year = "levelInvalid";

  if (p.bio.length > BIO_MAX) e.bio = "bioTooLong";
  return e;
}

// Clés d'erreur : "<id>.label", "<id>.url", "<id>.type" ou "links" (global)
export function validateLinks(links) {
  const e = {};
  if (links.length > MAX_LINKS) e.links = "tooManyLinks";
  for (const link of links) {
    if (!LINK_TYPES.includes(link.type)) e[`${link.id}.type`] = "typeInvalid";

    if (!link.label) e[`${link.id}.label`] = "required";
    else if (link.label.length > 30) e[`${link.id}.label`] = "tooLong";

    if (!link.url) e[`${link.id}.url`] = "required";
    else {
      const err = urlError(link.url, HOSTS[link.type]);
      if (err) e[`${link.id}.url`] = err;
      else if (link.url.length > 300) e[`${link.id}.url`] = "tooLong";
    }
  }
  return e;
}

// Vérifie les premiers octets : un .exe renommé en .png est refusé.
export function imageSignatureOk(bytes) {
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return png || jpeg;
}
