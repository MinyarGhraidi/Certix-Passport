import {
  getCachedPreview,
  setCachedPreview,
  invalidateCachedPreview,
  clearPreviewCache,
} from "./filePreviewCache.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(`FAIL: ${message}`);
  }

  console.log(`PASS: ${message}`);
}

function runTests() {
  console.log("Starting file preview cache tests...");

  // Test 1: Store and retrieve a value.
  clearPreviewCache();
  setCachedPreview("preview-1", "test-content");
  assert(
    getCachedPreview("preview-1") === "test-content",
    "Cache stores and retrieves a preview"
  );

  // Test 2: Missing keys return null.
  assert(
    getCachedPreview("missing-preview") === null,
    "Missing preview returns null"
  );

  // Test 3: Invalidate one entry.
  invalidateCachedPreview("preview-1");
  assert(
    getCachedPreview("preview-1") === null,
    "Invalidation removes the requested entry"
  );

  // Test 4: Clearing removes all entries.
  setCachedPreview("preview-2", "content-2");
  setCachedPreview("preview-3", "content-3");
  clearPreviewCache();
  assert(
    getCachedPreview("preview-2") === null &&
      getCachedPreview("preview-3") === null,
    "Clear removes all cached previews"
  );

  // Test 5: Maximum cache size.
  clearPreviewCache();

  for (let i = 0; i < 25; i += 1) {
    setCachedPreview(`preview-${i}`, `content-${i}`);
  }

  assert(
    getCachedPreview("preview-0") === null,
    "Oldest entries are evicted when the cache limit is exceeded"
  );

  assert(
    getCachedPreview("preview-24") === "content-24",
    "Newest entry remains in the cache"
  );

  // Test 6: TTL expiration.
  clearPreviewCache();
  setCachedPreview("ttl-preview", "temporary-content");

  const originalNow = Date.now;

  try {
    Date.now = () => originalNow() + 6 * 60 * 1000;

    assert(
      getCachedPreview("ttl-preview") === null,
      "Expired preview is not returned after the TTL"
    );
  } finally {
    Date.now = originalNow;
    clearPreviewCache();
  }

  // Test 7: Reject empty keys and non-string values.
  setCachedPreview("", "should-not-be-stored");
  setCachedPreview("invalid-value", { secret: "data" });

  assert(getCachedPreview("") === null, "Empty cache key is rejected");

  assert(
    getCachedPreview("invalid-value") === null,
    "Non-string preview values are rejected"
  );

  clearPreviewCache();
  console.log("Cache tests finished.");
}

runTests();
