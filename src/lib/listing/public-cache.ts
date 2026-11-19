type Entry = { value: unknown; expiresAt: number };

const DEFAULT_TTL_MS = 15_000;

const store = new Map<string, Entry>();

/**
 * Small TTL cache for public, read-mostly reads.
 *
 * The framework alternative (`unstable_cache`) was not usable here: without
 * Cache Components, its `revalidate` window is not honoured, so an entry
 * created while a listing was published kept being served after the listing
 * went back to draft — a moderation leak, not a perf trade-off.
 *
 * A TTL bounds staleness for every caller, including a process that missed an
 * invalidation, and `clearPublicCache` makes read-your-own-writes immediate in
 * the common single-process deployment. Multi-instance deployments need a
 * shared cache; that is a Phase 7 concern and the TTL keeps the blast radius
 * to one window.
 */
export async function cachedByKey<T>(
  key: string,
  load: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);

  if (hit && hit.expiresAt > now) {
    return hit.value as T;
  }

  const value = await load();
  store.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

/** Empties entries whose key starts with `prefix` (all entries when omitted). */
export function clearPublicCache(prefix?: string) {
  if (!prefix) {
    store.clear();
    return;
  }

  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/** Test helper: current entry count. */
export function publicCacheSize() {
  return store.size;
}
