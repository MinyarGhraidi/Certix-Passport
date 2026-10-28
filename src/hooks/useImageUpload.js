import { useCallback, useEffect, useRef, useState } from "react";
import { uploadImage, removeImage } from "../services/profileApi.js";
import { IMAGE_TYPES, MAX_IMAGE_SIZE, imageSignatureOk } from "../../shared/validation.js";

// Vérifie le fichier AVANT l'envoi (type, extension, taille, contenu réel)
async function checkFile(file) {
  if (!IMAGE_TYPES.includes(file.type) || !/\.(png|jpe?g)$/i.test(file.name)) return "invalid_type";
  if (file.size > MAX_IMAGE_SIZE) return "file_too_large";
  if (file.size === 0) return "invalid_image";
  try {
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    return imageSignatureOk(bytes) ? null : "invalid_type";
  } catch {
    return "invalid_image";
  }
}

// Charge la nouvelle image avant de retirer l'aperçu => pas de clignotement.
// Délai de sécurité (3 s) : l'interface ne reste jamais bloquée sur l'aperçu.
function preload(url) {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);
    const img = new Image();
    img.onload = img.onerror = () => {
      clearTimeout(timer);
      resolve();
    };
    img.src = url;
  });
}

// kind : "avatar" | "cover" — onProfile : reçoit le profil à jour renvoyé par le serveur
export function useImageUpload(kind, onProfile) {
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(null); // null = pas d'envoi en cours
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState(""); // code d'erreur
  const controller = useRef(null);
  const previewUrl = useRef("");

  useEffect(
    () => () => {
      controller.current?.abort();
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    []
  );

  const start = useCallback(
    async (file) => {
      setError("");
      const problem = await checkFile(file);
      if (problem) {
        setError(problem);
        return;
      }

      const url = URL.createObjectURL(file);
      previewUrl.current = url;
      setPreview(url);
      setProgress(0);
      const ctrl = new AbortController();
      controller.current = ctrl;

      try {
        const profile = await uploadImage(kind, file, setProgress, ctrl.signal);
        await preload(profile[`${kind}Url`]);
        onProfile(profile); // rafraîchit le profil avec l'image du serveur
      } catch (err) {
        if (err.code !== "aborted") setError(err.code || "server");
      } finally {
        URL.revokeObjectURL(url);
        previewUrl.current = "";
        setPreview("");
        setProgress(null);
        controller.current = null;
      }
    },
    [kind, onProfile]
  );

  const remove = useCallback(async () => {
    setError("");
    setRemoving(true);
    try {
      onProfile(await removeImage(kind));
    } catch (err) {
      setError(err.code || "server");
    } finally {
      setRemoving(false);
    }
  }, [kind, onProfile]);

  return { preview, progress, error, busy: progress !== null || removing, start, remove };
}
