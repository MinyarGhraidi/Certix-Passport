import { CACHE_POLICY } from "./cachePolicy.js";

const cache = new Map();

export function getCachedPreview(key) {
  if (
    !CACHE_POLICY.filePreview.enabled ||
    typeof key !== "string" ||
    key.trim() === ""
  ) {
    return null;
  }

  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() - entry.createdAt >= CACHE_POLICY.filePreview.ttlMs) {
    cache.delete(key);
    return null;
  }

  // Refresh entry position for LRU behavior.
  cache.delete(key);
  cache.set(key, entry);

  return entry.value;
}

export function setCachedPreview(key, value) {
  if (
    !CACHE_POLICY.filePreview.enabled ||
    typeof key !== "string" ||
    key.trim() === "" ||
    value == null
  ) {
    return;
  }

  // Do not cache large values or file objects.
  if (typeof value !== "string" || value.length > 1_000_000) {
    return;
  }

  cache.delete(key);

  cache.set(key, {
    value,
    createdAt: Date.now(),
  });

  while (cache.size > CACHE_POLICY.filePreview.maxEntries) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
}

export function invalidateCachedPreview(key) {
  if (typeof key === "string" && key.trim() !== "") {
    cache.delete(key);
  }
}

export function clearPreviewCache() {
  cache.clear();
}
