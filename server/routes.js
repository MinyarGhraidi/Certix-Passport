import { Router } from "express";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, readProfile, updateProfile, toPublic } from "./store.js";
import {
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  cleanProfile,
  validateProfile,
  cleanLinks,
  validateLinks,
  imageSignatureOk,
} from "../shared/validation.js";

const router = Router();

// ---------- Profil ----------

router.get("/profile", async (req, res) => {
  res.json(toPublic(await readProfile()));
});

router.put("/profile", async (req, res) => {
  const data = cleanProfile(req.body);
  const fields = validateProfile(data);
  if (Object.keys(fields).length > 0) {
    return res.status(422).json({ error: "validation", fields });
  }
  const profile = await updateProfile((current) => ({ ...current, ...data }));
  res.json(toPublic(profile));
});

router.put("/profile/links", async (req, res) => {
  const links = cleanLinks(req.body?.links).map((l) => ({
    ...l,
    id: l.id || crypto.randomUUID(),
  }));
  const fields = validateLinks(links);
  if (Object.keys(fields).length > 0) {
    return res.status(422).json({ error: "validation", fields });
  }
  const profile = await updateProfile((current) => ({ ...current, links }));
  res.json(toPublic(profile));
});

// ---------- Images (avatar et cover) ----------

async function removeFile(name) {
  if (!name) return;
  await fs.rm(path.join(UPLOAD_DIR, path.basename(name)), { force: true });
}

async function startsWithImage(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const bytes = Buffer.alloc(8);
    await handle.read(bytes, 0, 8, 0);
    return imageSignatureOk(bytes);
  } finally {
    await handle.close();
  }
}

for (const kind of ["avatar", "cover"]) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: UPLOAD_DIR,
      filename: (req, file, cb) => {
        const ext = file.mimetype === "image/png" ? ".png" : ".jpg";
        cb(null, `${kind}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
      },
    }),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
    fileFilter: (req, file, cb) => {
      if (IMAGE_TYPES.includes(file.mimetype)) return cb(null, true);
      cb(Object.assign(new Error("invalid_type"), { code: "INVALID_TYPE" }));
    },
  }).single("image");

  router.post(`/profile/${kind}`, upload, async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "no_file" });

    try {
      if (!(await startsWithImage(req.file.path))) {
        await removeFile(req.file.filename);
        return res.status(415).json({ error: "invalid_type" });
      }
      let previous = "";
      const profile = await updateProfile((current) => {
        previous = current[`${kind}File`];
        return {
          ...current,
          [`${kind}File`]: req.file.filename,
          [`${kind}UpdatedAt`]: Date.now(),
        };
      });
      await removeFile(previous); // remplace l'ancienne image
      res.json(toPublic(profile));
    } catch (error) {
      await removeFile(req.file.filename);
      throw error;
    }
  });

  router.delete(`/profile/${kind}`, async (req, res) => {
    let previous = "";
    const profile = await updateProfile((current) => {
      previous = current[`${kind}File`];
      return { ...current, [`${kind}File`]: "", [`${kind}UpdatedAt`]: Date.now() };
    });
    await removeFile(previous);
    res.json(toPublic(profile));
  });
}

export default router;
