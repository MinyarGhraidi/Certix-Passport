/* Couche API partagée par toutes les pages.
   VITE_API_URL vide = mode démo (fausses réponses, données dans localStorage).
   Format de retour : { ok, status, body }  — à confirmer avec le backend. */
const API_URL = import.meta.env.VITE_API_URL || "";
const KEY = "certix-demo-items";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const seed = [
  { id: "1", category: "achievement", title: "Hackathon finalist", organization: "CypherOut", startDate: "2026-03-10", endDate: "2026-03-12", description: "", status: "verified", rejectionReason: "", visibility: "public" },
  { id: "2", category: "certification", title: "Cloud Fundamentals", organization: "Cloud Academy", startDate: "2026-05-01", endDate: "2026-05-01", description: "", status: "pending", rejectionReason: "", visibility: "private" },
  { id: "3", category: "project", title: "Portfolio website", organization: "Personal", startDate: "2025-11-02", endDate: "2026-01-15", description: "Static portfolio.", status: "rejected", rejectionReason: "The evidence file is unreadable. Please upload a clearer copy.", visibility: "private" },
  { id: "4", category: "internship", title: "Web developer intern", organization: "Acme Studio", startDate: "2025-07-01", endDate: "2025-08-30", description: "", status: "verified", rejectionReason: "", visibility: "private" },
];
const read = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ } return seed; };
const write = (items) => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } };
const res = (ok, status, body = {}) => ({ ok, status, body });

/* ---------- Mode démo ---------- */
async function demo(path, method, body) {
  await wait(600);
  const data = body instanceof FormData ? Object.fromEntries(body) : body || {};
  const items = read();
  let m;

  if (path === "/auth/login")
    return /^(admin|student)@test\.com$/.test(data.email) && data.password === "Password1"
      ? res(true, 200, { role: data.email.startsWith("admin") ? "admin" : "student" })
      : res(false, 401);
  if (path === "/auth/forgot-password") return res(true, 200);
  if (path === "/auth/reset-password") return data.token === "expired" ? res(false, 410) : res(true, 200);
  if (path === "/auth/confirm-email") return data.token === "expired" ? res(false, 410) : res(true, 200);

  if (path === "/passport/items" && method === "GET") return res(true, 200, { items });
  if (path === "/passport/items" && method === "POST") {
    const item = { id: String(Date.now()), category: data.category, title: data.title, organization: data.organization, startDate: data.startDate, endDate: data.endDate || data.startDate, description: data.description || "", status: "pending", rejectionReason: "", visibility: "private" };
    write([item, ...items]);
    return res(true, 201, { item });
  }
  if ((m = path.match(/^\/passport\/items\/(\w+)$/)) && method === "PUT") {
    const next = items.map((i) => (i.id === m[1] ? { ...i, ...data, status: "pending", rejectionReason: "" } : i));
    write(next);
    return res(true, 200, { item: next.find((i) => i.id === m[1]) });
  }
  if ((m = path.match(/^\/passport\/items\/(\w+)\/visibility$/))) {
    const target = items.find((i) => i.id === m[1]);
    if (!target || /FAIL/.test(target.title)) return res(false, 500);   // test d'échec : titre contenant "FAIL"
    write(items.map((i) => (i.id === m[1] ? { ...i, visibility: data.visibility } : i)));
    return res(true, 200, { visibility: data.visibility });
  }
  if (path === "/passport/public") {
    let on = true; try { on = localStorage.getItem("certix-demo-sharing") !== "off"; } catch { /* ignore */ }  // mets "off" pour tester
    if (!on) return res(true, 200, { sharingEnabled: false, items: [] });
    const pub = items.filter((i) => i.visibility === "public" && i.status === "verified")
      .map(({ id, category, title, organization, startDate, endDate, status }) => ({ id, category, title, organization, startDate, endDate, status }));
    return res(true, 200, { sharingEnabled: true, items: pub });
  }
  return res(false, 404);
}

export async function api(path, { method = "GET", body } = {}) {
  if (!API_URL) return demo(path, method, body);
  const options = { method, credentials: "include" };
  if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }
  const response = await fetch(API_URL + path, options);
  let data = {};
  try { data = await response.json(); } catch { /* pas de JSON */ }
  return res(response.ok, response.status, data);
}

/* Envoi de fichier avec progression (FormData) */
export function upload(path, formData, onProgress, method = "POST") {
  return new Promise((resolve) => {
    if (!API_URL) {
      let p = 0;
      const id = setInterval(() => {
        p += 25; onProgress(Math.min(p, 100));
        if (p >= 100) { clearInterval(id); demo(path, method, formData).then(resolve); }
      }, 250);
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open(method, API_URL + path);
    xhr.withCredentials = true;
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      let b = {}; try { b = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      resolve(res(xhr.status >= 200 && xhr.status < 300, xhr.status, b));
    });
    xhr.addEventListener("error", () => resolve(res(false, 0)));
    xhr.send(formData);
  });
}
