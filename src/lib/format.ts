import { brand } from "./brand";

/** Prisma returns `Decimal` objects; accept anything numeric-shaped. */
export type Numeric = number | string | { toNumber: () => number };

export function toNumber(value: Numeric): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber();
}

export function formatPrice(
  value: Numeric | null | undefined,
  currency: string = brand.currency,
  options: { compact?: boolean } = {},
): string {
  if (value === null || value === undefined) return "—";

  const amount = toNumber(value);
  if (!Number.isFinite(amount)) return "—";

  return new Intl.NumberFormat(brand.locale, {
    style: "currency",
    currency,
    notation: options.compact ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(
  date: Date | string,
  now: Date = new Date(),
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - value.getTime();

  if (Number.isNaN(diffMs)) return "—";

  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
}

export function formatDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleDateString(brand.locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Unique enough for listings: the timestamp orders them, and the random suffix
 * keeps two creates in the same millisecond from colliding on the slug's
 * unique index.
 */
export function createListingSlug(title: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slugify(title) || "listing"}-${Date.now()}-${suffix}`;
}

export function formatArea(
  size: string | number | null | undefined,
  unit: string | null | undefined,
): string {
  if (size === null || size === undefined || size === "") {
    return "—";
  }

  return unit ? `${size} ${unit}` : String(size);
}

/** Two-letter monogram for avatars: "Ada Obi" → "AO". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
