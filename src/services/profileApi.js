// Version SANS serveur : le profil est enregistré dans le navigateur (localStorage).
// Les fonctions gardent exactement les mêmes noms et signatures que la version
// avec API : pour brancher un vrai serveur plus tard, il suffira de réécrire ce fichier.
import {
  cleanProfile,
  validateProfile,
  cleanLinks,
  validateLinks,
} from "../../shared/validation.js";

const STORAGE_KEY = "certix-settings-profile";
const MAX_SIDE = { avatar: 256, cover: 1200 }; // taille max (px) pour ne pas saturer le stockage

// Profil de départ (celui du design)
const DEFAULT_PROFILE = {
  firstName: "Amira",
  lastName: "Mansour",
  username: "amira.mansour",
  website: "https://example.com",
  university: "University of Carthage",
  club: "Innovate Club",
  program: "Computer Science BSc",
  year: "LGLSI 3",
  bio: "Student builder focused on product design and community impact projects.",
  links: [
    { id: "default-linkedin", type: "LinkedIn", label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
  avatarUrl: "", // data URL de l'image
  coverUrl: "",
};

export class ApiError extends Error {
  constructor(code, fields = {}) {
    super(code);
    this.code = code;
    this.fields = fields;
  }
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    /* données illisibles : on repart du profil par défaut */
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
}

function write(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    throw new ApiError("storage"); // stockage plein ou désactivé
  }
  return profile;
}

export async function getProfile() {
  return read();
}

export async function saveProfile(fields) {
  const data = cleanProfile(fields);
  const errors = validateProfile(data);
  if (Object.keys(errors).length > 0) throw new ApiError("validation", errors);
  return write({ ...read(), ...data });
}

export async function saveLinks(links) {
  const clean = cleanLinks(links).map((link) => ({ ...link, id: link.id || crypto.randomUUID() }));
  const errors = validateLinks(clean);
  if (Object.keys(errors).length > 0) throw new ApiError("validation", errors);
  return write({ ...read(), links: clean });
}

export async function removeImage(kind) {
  return write({ ...read(), [`${kind}Url`]: "" });
}

// ----- Envoi d'une image (lecture + réduction dans le navigateur) -----

function readFile(file, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 60));
    };
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new ApiError("invalid_image"));
    reader.onabort = () => reject(new ApiError("aborted"));
    signal?.addEventListener("abort", () => reader.abort());
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ApiError("invalid_image"));
    img.src = src;
  });
}

// Réduit l'image et la convertit en JPEG (fond blanc pour les PNG transparents)
function shrink(img, maxSide) {
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export async function uploadImage(kind, file, onProgress, signal) {
  const stopIfAborted = () => {
    if (signal?.aborted) throw new ApiError("aborted");
  };

  const dataUrl = await readFile(file, onProgress, signal);
  stopIfAborted();
  onProgress(75);

  const img = await loadImage(dataUrl);
  stopIfAborted();
  onProgress(90);

  const profile = write({ ...read(), [`${kind}Url`]: shrink(img, MAX_SIDE[kind]) });
  onProgress(100);
  return profile;
}
