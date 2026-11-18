import { z } from "zod";

const trimmed = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const enquirySchema = z.object({
  listingId: z.string().min(1),
  name: z
    .preprocess(trimmed, z.string().min(2, "Please enter your name.").max(80)),
  email: z.preprocess(
    trimmed,
    z.email("Enter a valid email address.").max(160),
  ),
  phone: z.preprocess(
    trimmed,
    z
      .string()
      .max(24)
      .refine(
        (value) => value === "" || /^[+0-9][0-9 ()-]{6,23}$/.test(value),
        "Enter a valid phone number, or leave it blank.",
      ),
  ),
  message: z.preprocess(
    trimmed,
    z
      .string()
      .min(20, "Tell the agent a little more — at least 20 characters.")
      .max(2_000),
  ),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

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
