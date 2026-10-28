// Stockage du profil dans un fichier JSON (server/data/profile.json).
// Pas de base de données : suffisant pour un seul profil.
import fs from "node:fs/promises";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(here, "data");
const DATA_FILE = path.join(DATA_DIR, "profile.json");
export const UPLOAD_DIR = path.join(here, "uploads");

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(UPLOAD_DIR, { recursive: true });

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
  avatarFile: "",
  avatarUpdatedAt: 0,
  coverFile: "",
  coverUpdatedAt: 0,
};

export async function readProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(await fs.readFile(DATA_FILE, "utf8")) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

async function writeProfile(profile) {
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(profile, null, 2));
  await fs.rename(tmp, DATA_FILE); // écriture atomique
}

// File d'attente : deux requêtes simultanées ne s'écrasent pas.
let queue = Promise.resolve();
export function updateProfile(mutate) {
  const run = queue.then(async () => {
    const next = await mutate(await readProfile());
    await writeProfile(next);
    return next;
  });
  queue = run.catch(() => {});
  return run;
}

// Ce que l'on envoie au navigateur (URLs au lieu de noms de fichiers)
export function toPublic(profile) {
  const { avatarFile, avatarUpdatedAt, coverFile, coverUpdatedAt, ...rest } = profile;
  return {
    ...rest,
    avatarUrl: avatarFile ? `/uploads/${avatarFile}?v=${avatarUpdatedAt}` : "",
    coverUrl: coverFile ? `/uploads/${coverFile}?v=${coverUpdatedAt}` : "",
  };
}
