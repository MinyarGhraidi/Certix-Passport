/**
 * Shared HTTP API Client for CertiX Passport API Gateway (FastAPI)
 * Microservices behind the gateway:
 *  - User Service: /auth/*, /me, /admin/users
 *  - Event Service: /events/*, /admin/events/*
 *  - Achievement Service: /me/items*, /me/achievements, /admin/items*, /admin/stats
 *  - Passport Service: /me/passport, /me/share, /me/qrcode, /public/:slug*
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USE_MOCK_API =
  String(import.meta.env.VITE_USE_MOCK_API ?? "true").toLowerCase() !== "false";

const TOKEN_STORAGE_KEY = "certix_access_token";

export function getAuthToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token, remember = true) {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    if (!token) return;
    if (remember) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  } catch {
    // ignore storage errors
  }
}

export class ApiError extends Error {
  constructor({ status = 500, code = "api_error", message = "Request failed", fields = {} }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (contentType.includes("application/pdf") || contentType.includes("image/")) {
    return response.blob();
  }
  const text = await response.text();
  return text ? { message: text } : null;
}

function normalizeError(status, payload) {
  if (!payload || typeof payload !== "object") {
    return new ApiError({ status, message: "Une erreur serveur est survenue." });
  }

  // FastAPI validation error array format
  if (Array.isArray(payload.detail)) {
    const fields = {};
    for (const err of payload.detail) {
      const key = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : "general";
      fields[key] = err.msg;
    }
    return new ApiError({
      status,
      code: "validation_error",
      message: "Certains champs sont invalides.",
      fields,
    });
  }

  return new ApiError({
    status,
    code: payload.code || "api_error",
    message: payload.detail || payload.message || "Erreur lors de la requête.",
    fields: payload.fields || {},
  });
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    params,
    signal,
    auth = true,
  } = options;

  let url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (params && typeof params === "object") {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") {
        query.append(k, String(v));
      }
    });
    const qs = query.toString();
    if (qs) url += `?${qs}`;
  }

  const finalHeaders = { ...headers };
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    signal,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("certix:unauthorized"));
    }
    throw normalizeError(response.status, payload);
  }

  return payload;
}

/**
 * Upload multipart/form-data with real progress reporting via XHR
 */
export function apiUpload(path, formData, { method = "POST", onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

    xhr.open(method, url, true);
    const token = getAuthToken();
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = { message: xhr.responseText };
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(normalizeError(xhr.status, data));
      }
    };

    xhr.onerror = () => {
      reject(new ApiError({ status: 0, code: "network_error", message: "Erreur réseau lors de l'envoi." }));
    };

    xhr.onabort = () => {
      reject(new ApiError({ status: 0, code: "aborted", message: "Envoi annulé." }));
    };

    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.send(formData);
  });
}

export const ENDPOINTS = {
  // User Service
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  RESET_PASSWORD_REQUEST: "/auth/reset-password",
  RESET_PASSWORD_CONFIRM: "/auth/reset-password/confirm",
  ME: "/me",
  ME_AVATAR: "/me/avatar",
  ADMIN_USERS: "/admin/users",

  // Event Service
  EVENTS: "/events",
  EVENT_BY_ID: (id) => `/events/${id}`,
  EVENT_PARTICIPANTS: (id) => `/events/${id}/participants`,
  EVENT_PARTICIPANT_BY_ID: (id, pid) => `/events/${id}/participants/${pid}`,
  ADMIN_EVENTS: "/admin/events",
  ADMIN_EVENT_BY_ID: (id) => `/admin/events/${id}`,
  ADMIN_EVENT_STATUS: (id) => `/admin/events/${id}/status`,
  ADMIN_EVENT_ACHIEVEMENTS: (id) => `/admin/events/${id}/achievements`,

  // Achievement & Passport Service
  ME_PASSPORT: "/me/passport",
  ME_ACHIEVEMENTS: "/me/achievements",
  ME_ITEMS: "/me/items",
  ME_ITEM_BY_ID: (id) => `/me/items/${id}`,
  ME_SHARE: "/me/share",
  ME_QRCODE: "/me/qrcode",
  PUBLIC_PASSPORT: (slug) => `/public/${slug}`,
  PUBLIC_PASSPORT_PDF: (slug) => `/public/${slug}/pdf`,
  ADMIN_ITEMS: "/admin/items",
  ADMIN_ITEM_BY_ID: (id) => `/admin/items/${id}`,
  ADMIN_STATS: "/admin/stats",
};
