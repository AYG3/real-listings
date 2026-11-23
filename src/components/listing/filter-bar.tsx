import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import {
  activeChips,
  SORT_OPTIONS,
  type SearchFilters,
} from "@/lib/listing/filters";

const PRICE_STEPS = [
  { value: "25000000", label: "₦25m" },
  { value: "50000000", label: "₦50m" },
  { value: "75000000", label: "₦75m" },
  { value: "100000000", label: "₦100m" },
  { value: "200000000", label: "₦200m" },
  { value: "500000000", label: "₦500m" },
  { value: "1000000000", label: "₦1b" },
];

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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))] xl:grid-cols-[repeat(8,minmax(0,1fr))]">
          <TextField
            id="filter-q"
            name="q"
            type="search"
            label="Search"
            defaultValue={filters.q}
            placeholder="City, area, or keyword"
            wrapperClassName="sm:col-span-2 xl:col-span-2"
          />

          <SelectField
            id="filter-intent"
            name="intent"
            label="Purpose"
            defaultValue={filters.intent?.toLowerCase() ?? ""}
            active={Boolean(filters.intent)}
          >
            <option value="">Any</option>
            <option value="sale">For sale</option>
            <option value="rent">For rent</option>
          </SelectField>

          <SelectField
            id="filter-type"
            name="type"
            label="Type"
            defaultValue={filters.type?.toLowerCase() ?? ""}
            active={Boolean(filters.type)}
          >
            <option value="">Any</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </SelectField>

          <SelectField
            id="filter-min-price"
            name="minPrice"
            label="Min price"
            defaultValue={filters.minPrice ? String(filters.minPrice) : ""}
            active={filters.minPrice !== null}
          >
            <option value="">Any</option>
            {PRICE_STEPS.map((step) => (
              <option key={step.value} value={step.value}>
                {step.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-max-price"
            name="maxPrice"
            label="Max price"
            defaultValue={filters.maxPrice ? String(filters.maxPrice) : ""}
            active={filters.maxPrice !== null}
          >
            <option value="">Any</option>
            {PRICE_STEPS.map((step) => (
              <option key={step.value} value={step.value}>
                {step.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-beds"
            name="beds"
            label="Beds"
            defaultValue={filters.beds ? String(filters.beds) : ""}
            active={filters.beds !== null}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </SelectField>

          <TextField
            id="filter-state"
            name="state"
            type="text"
            label="State"
            defaultValue={filters.state ?? ""}
            placeholder="e.g. Lagos"
          />

          <SelectField
            id="filter-sort"
            name="sort"
            label="Sort"
            defaultValue={filters.sort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          <div className="flex min-w-0 items-end sm:col-span-2 xl:col-span-2">
            <Button type="submit" className="w-full">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
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
              className="inline-flex items-center gap-1.5 rounded-full border border-forest-700/25 bg-forest-700/5 py-1.5 pl-3 pr-2 text-xs font-semibold text-forest-700 transition-colors hover:bg-forest-700/10"
            >
              {chip.label}
              <span className="-mr-0.5 rounded-full p-1">
                <X className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </span>
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
