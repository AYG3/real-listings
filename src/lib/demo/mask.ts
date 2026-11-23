/**
 * Pure masking helpers for the read-only demo.
 *
 * These run on the server, before a value is serialised into the RSC payload —
 * a masked value is never a rendering trick, it is the only value the demo
 * browser receives. Everything here is idempotent and safe on null/empty input
 * so call sites never need their own guards.
 */

const DOT = "•";
const FIXED_DOTS = DOT.repeat(6);

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE_PATTERN = /\+?\d[\d\s().-]{7,}\d/g;

function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
}

function maskToken(value: string) {
  return `${value.slice(0, 1)}${FIXED_DOTS}`;
}

/** `adaeze.okafor@alara.ng` → `a••••••@alara.ng` (fixed width: the length does not leak). */
export function maskEmail(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (isBlank(value)) return "";

  const trimmed = value.trim();
  const at = trimmed.lastIndexOf("@");

  if (at <= 0 || at === trimmed.length - 1) return maskToken(trimmed);

  return `${trimmed.slice(0, 1)}${FIXED_DOTS}@${trimmed.slice(at + 1)}`;
}

/** `+234 801 234 5678` → `+234 ••• ••• 678` (country code and last three kept). */
export function maskPhone(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (isBlank(value)) return "";

  const digits = value.replace(/\D/g, "");
  if (digits.length < 7) return `${DOT.repeat(3)} ${DOT.repeat(4)}`;

  const country = value.trim().startsWith("+") ? digits.slice(0, 3) : "";
  const lastThree = digits.slice(-3);

  return `${country ? `+${country} ` : ""}${DOT.repeat(3)} ${DOT.repeat(3)} ${lastThree}`;
}

/** `Chidi Okafor` → `Chidi O.` — the given name stays readable, the surname does not. */
export function maskName(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (isBlank(value)) return "";

  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return maskToken(parts[0]);

  return `${parts[0]} ${parts[parts.length - 1].slice(0, 1).toUpperCase()}.`;
}

/**
 * Masks emails and phone numbers inside free text (an enquiry body, an agent
 * note). Dates, prices and reference numbers are left alone: the phone pattern
 * requires at least nine digits.
 */
export function maskFreeText(value: string | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  if (isBlank(value)) return "";

  return value
    .replace(EMAIL_PATTERN, (match) => maskEmail(match) ?? match)
    .replace(PHONE_PATTERN, (match) => {
      const digits = match.replace(/\D/g, "");
      if (digits.length < 9) return match;
      return maskPhone(match) ?? match;
    });
}

/** Applies `mask` only when the session is a demo, so call sites stay branch-free. */
export function maybeMask<T>(
  value: T,
  redact: boolean,
  mask: (input: T) => T,
): T {
  return redact ? mask(value) : value;
}
