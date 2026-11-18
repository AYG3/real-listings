export const PAGE_SIZE = 12;

export type Intent = "SALE" | "RENT";
export type ListingTypeFilter = "HOUSE" | "LAND";
export type SortKey = "newest" | "price-asc" | "price-desc";

export type SearchFilters = {
  q: string;
  intent: Intent | null;
  type: ListingTypeFilter | null;
  state: string | null;
  city: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  beds: number | null;
  sort: SortKey;
  page: number;
};

type RawParams = Record<string, string | string[] | undefined>;

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const DEFAULT_FILTERS: SearchFilters = {
  q: "",
  intent: null,
  type: null,
  state: null,
  city: null,
  minPrice: null,
  maxPrice: null,
  beds: null,
  sort: "newest",
  page: 1,
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Trim, collapse whitespace, and cap length so URLs stay sane. */
function text(value: string | undefined, max = 120): string {
  return (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function positiveInt(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * URL parameters are user input, so every field is validated into a known
 * shape. Unknown or malformed values fall back to the default instead of
 * reaching Prisma.
 */
export function parseFilters(raw: RawParams): SearchFilters {
  const intent = first(raw.intent)?.toUpperCase();
  const type = first(raw.type)?.toUpperCase();
  const sort = first(raw.sort) as SortKey | undefined;

  const minPrice = positiveInt(first(raw.minPrice));
  const maxPriceRaw = positiveInt(first(raw.maxPrice));
  const maxPrice =
    maxPriceRaw !== null && minPrice !== null && maxPriceRaw < minPrice
      ? minPrice
      : maxPriceRaw;

  return {
    q: text(first(raw.q)),
    intent: intent === "SALE" || intent === "RENT" ? intent : null,
    type: type === "HOUSE" || type === "LAND" ? type : null,
    state: text(first(raw.state), 60) || null,
    city: text(first(raw.city), 60) || null,
    minPrice,
    maxPrice,
    beds: positiveInt(first(raw.beds)),
    sort:
      sort && SORT_OPTIONS.some((option) => option.value === sort)
        ? sort
        : DEFAULT_FILTERS.sort,
    page: positiveInt(first(raw.page)) ?? 1,
  };
}

/** Serialise filters back into a shareable query string (omits defaults). */
export function toQueryString(
  filters: SearchFilters,
  overrides: Partial<SearchFilters> = {},
): string {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.intent) params.set("intent", merged.intent.toLowerCase());
  if (merged.type) params.set("type", merged.type.toLowerCase());
  if (merged.state) params.set("state", merged.state);
  if (merged.city) params.set("city", merged.city);
  if (merged.minPrice) params.set("minPrice", String(merged.minPrice));
  if (merged.maxPrice) params.set("maxPrice", String(merged.maxPrice));
  if (merged.beds) params.set("beds", String(merged.beds));
  if (merged.sort !== DEFAULT_FILTERS.sort) params.set("sort", merged.sort);
  if (merged.page > 1) params.set("page", String(merged.page));

  const query = params.toString();
  return query ? `?${query}` : "";
}

export type ActiveChip = { key: string; label: string; href: string };

/** One removable chip per active facet, each linking to the reduced query. */
export function activeChips(filters: SearchFilters): ActiveChip[] {
  const chips: ActiveChip[] = [];

  const push = (
    key: string,
    label: string,
    override: Partial<SearchFilters>,
  ) => {
    chips.push({
      key,
      label,
      href: toQueryString(filters, { ...override, page: 1 }),
    });
  };

  if (filters.q) push("q", `“${filters.q}”`, { q: "" });
  if (filters.intent) {
    push("intent", filters.intent === "RENT" ? "For rent" : "For sale", {
      intent: null,
    });
  }
  if (filters.type) {
    push("type", filters.type === "LAND" ? "Land" : "House", { type: null });
  }
  if (filters.state) push("state", filters.state, { state: null });
  if (filters.city) push("city", filters.city, { city: null });
  if (filters.minPrice) {
    push("minPrice", `Min ₦${filters.minPrice.toLocaleString("en-NG")}`, {
      minPrice: null,
    });
  }
  if (filters.maxPrice) {
    push("maxPrice", `Max ₦${filters.maxPrice.toLocaleString("en-NG")}`, {
      maxPrice: null,
    });
  }
  if (filters.beds) push("beds", `${filters.beds}+ beds`, { beds: null });

  return chips;
}

export function hasActiveFilters(filters: SearchFilters): boolean {
  return activeChips(filters).length > 0;
}
