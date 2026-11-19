import { describe, expect, it } from "vitest";
import {
  createListingSlug,
  formatArea,
  formatPrice,
  formatRelativeTime,
  initials,
  slugify,
  toNumber,
} from "./format";

describe("toNumber", () => {
  it("accepts numbers, numeric strings and Prisma Decimals", () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber("42.5")).toBe(42.5);
    expect(toNumber({ toNumber: () => 7 })).toBe(7);
  });
});

describe("formatPrice", () => {
  it("formats NGN with no kobo", () => {
    expect(formatPrice(250_000_000).replace(/\s/g, " ")).toBe("₦250,000,000");
  });

  it("returns an em dash for missing values", () => {
    expect(formatPrice(null)).toBe("—");
    expect(formatPrice(undefined)).toBe("—");
  });

  it("returns an em dash rather than NaN for junk", () => {
    expect(formatPrice("not money")).toBe("—");
  });

  it("can compact large amounts", () => {
    expect(formatPrice(250_000_000, "NGN", { compact: true })).toContain("₦250M");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Modern 4 Bedroom Duplex!")).toBe("modern-4-bedroom-duplex");
  });

  it("strips leading and trailing separators", () => {
    expect(slugify("  — Lekki Phase 1 — ")).toBe("lekki-phase-1");
  });

  it("returns an empty string when there is nothing usable", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("createListingSlug", () => {
  it("stays unique for duplicate titles created in the same millisecond", () => {
    const first = createListingSlug("Green Villa");
    const second = createListingSlug("Green Villa");

    expect(first).toMatch(/^green-villa-\d+-[a-z0-9]{4}$/);
    expect(first).not.toBe(second);
  });

  it("falls back to a readable prefix", () => {
    expect(createListingSlug("!!!")).toMatch(/^listing-\d+-[a-z0-9]{4}$/);
  });
});

describe("formatArea", () => {
  it("joins size and unit", () => {
    expect(formatArea("420", "sqm")).toBe("420 sqm");
  });

  it("returns an em dash when the size is missing", () => {
    expect(formatArea("", "sqm")).toBe("—");
    expect(formatArea(null, "sqm")).toBe("—");
  });
});

describe("initials", () => {
  it("takes the first and last initial", () => {
    expect(initials("Ada Obi")).toBe("AO");
    expect(initials("Grace")).toBe("GR");
    expect(initials("  ")).toBe("?");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-11-19T12:00:00Z");

  it("describes recent gaps in minutes, hours and days", () => {
    expect(formatRelativeTime(new Date("2026-11-19T11:59:30Z"), now)).toBe("just now");
    expect(formatRelativeTime(new Date("2026-11-19T11:40:00Z"), now)).toBe("20m ago");
    expect(formatRelativeTime(new Date("2026-11-19T09:00:00Z"), now)).toBe("3h ago");
    expect(formatRelativeTime(new Date("2026-11-17T12:00:00Z"), now)).toBe("2d ago");
  });

  it("falls back to a date after a week", () => {
    expect(formatRelativeTime(new Date("2026-10-01T12:00:00Z"), now)).toMatch(/2026/);
  });
});
