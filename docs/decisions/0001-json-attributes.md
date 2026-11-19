# 0001 — Type-specific listing fields in a JSON column

**Status:** accepted · **Date:** November 2026

## Context

A listing is a house or a plot of land, and the two share almost nothing below
the headline. A house has bedrooms, bathrooms, toilets, parking and a year built.
Land has plot size, title document, and whether a survey plan exists. More types
are plausible later (commercial, short-let inventories).

Three options were on the table:

1. One wide `listings` table with a column per field, null for the fields that do
   not apply.
2. A table per listing type with a shared base table and joins.
3. A `listings` table for the shared fields plus a `attributes jsonb` column for
   the type-specific ones.

## Decision

Option 3. `listings.attributes` is `jsonb`, and the shape is documented in
[`prisma/schema.prisma`](../../prisma/schema.prisma):

```
HOUSE: { bedrooms, bathrooms, toilets, parking, furnished, propertySubtype }
LAND:  { sizeInPlots, titleType, surveyPlanAvailable }
```

`src/lib/validation/listing.ts` normalises the object before every write, so
only known keys with known value types reach the column, and blank optionals are
dropped instead of stored as `""`.

## Consequences

**Good**

- Adding a property type is a schema change in one place (the Zod schema), not a
  migration plus a join.
- The feed query reads one row per listing; there is no fan-out to a type table,
  which matters when a page is assembled across a 150 ms round trip.
- Filters on shared columns (`price`, `city`, `status`) stay indexed and simple.

**Bad**

- Postgres cannot enforce the contents. The Zod schema is the only guard, so any
  future writer must go through `listingInputSchema`.
- Filtering *inside* the JSON (for example "3+ bedrooms") needs an expression
  index before it can be fast. Today the bedroom filter is applied after the
  fetch, which is acceptable at this size and would not be at ten thousand rows.
- Type safety stops at `Prisma.JsonValue`; the read path casts through a small
  `asString` / `asNumber` helper per page.

## Revisit when

A third listing type arrives, or a JSON field becomes filterable at scale. At
that point the bedrooms/bathrooms counts — already regular, already filtered —
graduate to real columns and leave the truly optional fields in `attributes`.
