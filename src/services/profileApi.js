// Appels vers l'API Node. Les URLs commençant par /api et /uploads sont
// redirigées vers le serveur (port 4000) par le proxy de vite.config.js.

export class ApiError extends Error {
  constructor(code, fields = {}) {
    super(code);
    this.code = code;
    this.fields = fields;
  }
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError("network");
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(data?.error || "server", data?.fields);
  return data;
}

const json = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const getProfile = () => request("/api/profile");
export const saveProfile = (fields) => request("/api/profile", json("PUT", fields));
export const saveLinks = (links) => request("/api/profile/links", json("PUT", { links }));
export const removeImage = (kind) => request(`/api/profile/${kind}`, { method: "DELETE" });

// XMLHttpRequest (et non fetch) car fetch ne donne pas la progression d'envoi.
export function uploadImage(kind, file, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/profile/${kind}`);
    xhr.timeout = 30000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let data = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* réponse non JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data) {
        onProgress(100);
        resolve(data);
      } else {
        reject(new ApiError(data?.error || (xhr.status === 413 ? "file_too_large" : "server")));
      }
    };
    xhr.onerror = () => reject(new ApiError("network"));
    xhr.ontimeout = () => reject(new ApiError("network"));
    xhr.onabort = () => reject(new ApiError("aborted"));
    signal?.addEventListener("abort", () => xhr.abort());

    const body = new FormData();
    body.append("image", file);
    xhr.send(body);
  });
}
