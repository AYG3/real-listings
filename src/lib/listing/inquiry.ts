/**
 * Server-side spam controls for the enquiry form. The field rules themselves
 * live in `lib/validation/enquiry.ts` next to every other action schema.
 */

const WINDOW_MS = 60 * 60 * 1_000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED_KEYS = 5_000;

const hits = new Map<string, number[]>();

/**
 * Per-process sliding window. Good enough for a single demo instance; a
 * multi-instance deployment needs a shared store (Redis) instead.
 */
export function checkRateLimit(key: string): {
  ok: boolean;
  retryAfterMinutes?: number;
} {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = recent[0];
    return {
      ok: false,
      retryAfterMinutes: Math.max(
        1,
        Math.ceil((WINDOW_MS - (now - oldest)) / 60_000),
      ),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(storedKey);
    }
  }

  return { ok: true };
}

/** Best-effort client identity for rate limiting behind a proxy. */
export function clientKey(headerList: Headers): string {
  const forwarded = headerList.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim();
  return first || headerList.get("x-real-ip") || "unknown";
}
