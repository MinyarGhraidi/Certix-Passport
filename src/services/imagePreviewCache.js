import { CACHE_POLICY } from "./cachePolicy.js";

const cache = new Map();

export function getCachedImagePreview(key) {
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

export function setCachedImagePreview(key, value) {
  if (
    !CACHE_POLICY.filePreview.enabled ||
    typeof key !== "string" ||
    key.trim() === "" ||
    typeof value !== "string" ||
    !value.startsWith("blob:")
  ) {
    return;
  }

  cache.delete(key);
  cache.set(key, {
    value,
    createdAt: Date.now(),
  });

  while (cache.size > CACHE_POLICY.filePreview.maxEntries) {
    const oldestKey = cache.keys().next().value;
    const oldestEntry = cache.get(oldestKey);

    // Release the cached object URL when evicting it.
    if (oldestEntry?.value.startsWith("blob:")) {
      URL.revokeObjectURL(oldestEntry.value);
    }

    cache.delete(oldestKey);
  }
}

export function invalidateCachedImagePreview(key) {
  const entry = cache.get(key);

  if (entry?.value.startsWith("blob:")) {
    URL.revokeObjectURL(entry.value);
  }

  cache.delete(key);
}

export function clearImagePreviewCache() {
  for (const entry of cache.values()) {
    if (entry.value.startsWith("blob:")) {
      URL.revokeObjectURL(entry.value);
    }
  }

  cache.clear();
}
