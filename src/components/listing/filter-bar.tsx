import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { activeChips, SORT_OPTIONS, type SearchFilters } from "@/lib/listing/filters";

const PRICE_STEPS = [
  { value: "25000000", label: "₦25m" },
  { value: "50000000", label: "₦50m" },
  { value: "75000000", label: "₦75m" },
  { value: "100000000", label: "₦100m" },
  { value: "200000000", label: "₦200m" },
  { value: "500000000", label: "₦500m" },
  { value: "1000000000", label: "₦1b" },
];

const fieldClass =
  "h-11 w-full rounded-control border border-ink-900/15 bg-white px-3 text-sm text-ink-900 focus:border-forest-700 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-500";

/**
 * A plain GET form: the URL is the state, so every filter combination is
 * shareable and reloadable, and it works with JavaScript disabled.
 */
export function FilterBar({ filters }: { filters: SearchFilters }) {
  const chips = activeChips(filters);
  return (
    <section aria-labelledby="filters-heading" className="space-y-4">
      <h2 id="filters-heading" className="sr-only">
        Filter properties
      </h2>

      <form
        action="/properties"
        method="get"
        className="rounded-card border border-ink-900/10 bg-white p-4 shadow-card"
      >
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <div className="sm:col-span-2 xl:col-span-2">
            <label htmlFor="filter-q" className={labelClass}>
              Search
            </label>
            <input
              id="filter-q"
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder="City, area, or keyword"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="filter-intent" className={labelClass}>
              Purpose
            </label>
            <select
              id="filter-intent"
              name="intent"
              defaultValue={filters.intent?.toLowerCase() ?? ""}
              className={fieldClass}
            >
              <option value="">Any</option>
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-type" className={labelClass}>
              Type
            </label>
            <select
              id="filter-type"
              name="type"
              defaultValue={filters.type?.toLowerCase() ?? ""}
              className={fieldClass}
            >
              <option value="">Any</option>
              <option value="house">House</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-min-price" className={labelClass}>
              Min price
            </label>
            <select
              id="filter-min-price"
              name="minPrice"
              defaultValue={filters.minPrice ? String(filters.minPrice) : ""}
              className={fieldClass}
            >
              <option value="">Any</option>
              {PRICE_STEPS.map((step) => (
                <option key={step.value} value={step.value}>
                  {step.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-max-price" className={labelClass}>
              Max price
            </label>
            <select
              id="filter-max-price"
              name="maxPrice"
              defaultValue={filters.maxPrice ? String(filters.maxPrice) : ""}
              className={fieldClass}
            >
              <option value="">Any</option>
              {PRICE_STEPS.map((step) => (
                <option key={step.value} value={step.value}>
                  {step.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-beds" className={labelClass}>
              Beds
            </label>
            <select
              id="filter-beds"
              name="beds"
              defaultValue={filters.beds ? String(filters.beds) : ""}
              className={fieldClass}
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          <div>
            <label htmlFor="filter-state" className={labelClass}>
              State
            </label>
            <input
              id="filter-state"
              name="state"
              type="text"
              defaultValue={filters.state ?? ""}
              placeholder="e.g. Lagos"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="filter-sort" className={labelClass}>
              Sort
            </label>
            <select
              id="filter-sort"
              name="sort"
              defaultValue={filters.sort}
              className={fieldClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 xl:col-span-2">
            <Button type="submit" className="w-full">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Apply filters
            </Button>
          </div>
        </div>
      </form>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-500">
            Active
          </span>
          {chips.map((chip) => (
            <Link
              key={chip.key}
              href={`/properties${chip.href}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest-700/25 bg-forest-700/5 px-3 py-1.5 text-xs font-semibold text-forest-700 transition-colors hover:bg-forest-700/10"
            >
              {chip.label}
              <X className="h-3 w-3" aria-hidden />
              <span className="sr-only">Remove filter</span>
            </Link>
          ))}
          <Link
            href="/properties"
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            Clear all
          </Link>
        </div>
      ) : null}
    </section>
  );
}
