import { describe, expect, it } from "vitest";
import { DEFAULT_FILTERS, activeChips, parseFilters, toQueryString } from "./filters";

describe("parseFilters", () => {
  it("returns defaults for an empty query", () => {
    expect(parseFilters({})).toEqual(DEFAULT_FILTERS);
  });

  it("normalises case for intent, type and sort", () => {
    const filters = parseFilters({ intent: "rent", type: "house", sort: "price-asc" });

    expect(filters.intent).toBe("RENT");
    expect(filters.type).toBe("HOUSE");
    expect(filters.sort).toBe("price-asc");
  });

  it("drops unrecognised facets instead of passing them to Prisma", () => {
    const filters = parseFilters({ intent: "lease", type: "castle", sort: "cheapest" });

    expect(filters.intent).toBeNull();
    expect(filters.type).toBeNull();
    expect(filters.sort).toBe(DEFAULT_FILTERS.sort);
  });

  it("collapses whitespace and caps free text", () => {
    const filters = parseFilters({ q: "  lekki   phase 1  " });

    expect(filters.q).toBe("lekki phase 1");
    expect(parseFilters({ q: "x".repeat(300) }).q.length).toBe(120);
  });

  it("reads the first value when a parameter repeats", () => {
    expect(parseFilters({ city: ["Lekki", "Ikeja"] }).city).toBe("Lekki");
  });

  it("ignores non-numeric and negative numbers", () => {
    const filters = parseFilters({ minPrice: "free", maxPrice: "-5", beds: "0" });

    expect(filters.minPrice).toBeNull();
    expect(filters.maxPrice).toBeNull();
    expect(filters.beds).toBeNull();
  });

  it("clamps a max price below the min price up to the min", () => {
    expect(parseFilters({ minPrice: "500", maxPrice: "100" }).maxPrice).toBe(500);
  });

  it("defaults the page to one and rejects junk", () => {
    expect(parseFilters({}).page).toBe(1);
    expect(parseFilters({ page: "3" }).page).toBe(3);
    expect(parseFilters({ page: "abc" }).page).toBe(1);
  });
});

describe("toQueryString", () => {
  it("omits defaults and empty facets", () => {
    expect(toQueryString(DEFAULT_FILTERS)).toBe("");
  });

  it("round-trips through parseFilters", () => {
    const filters = parseFilters({ q: "duplex", intent: "rent", minPrice: "1000" });
    const query = toQueryString(filters);

    expect(query).toContain("q=duplex");
    expect(parseFilters(Object.fromEntries(new URLSearchParams(query.slice(1))))).toEqual(filters);
  });

  it("applies overrides without mutating the input", () => {
    const filters = parseFilters({ q: "duplex" });

    expect(toQueryString(filters, { q: "" })).toBe("");
    expect(filters.q).toBe("duplex");
  });
});

describe("activeChips", () => {
  it("lists one removable chip per active facet", () => {
    const chips = activeChips(parseFilters({ q: "duplex", intent: "rent", beds: "3" }));

    expect(chips.map((chip) => chip.key)).toEqual(["q", "intent", "beds"]);
  });

  it("returns nothing for defaults", () => {
    expect(activeChips(DEFAULT_FILTERS)).toEqual([]);
  });
});
