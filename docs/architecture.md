# Architecture

A Next.js 16 App Router application on one PostgreSQL database, with Better Auth
for identity, Prisma for data access, and Cloudinary for listing photography.

```
Browser ──▶ proxy.ts (cookie gate, security headers)
         ──▶ Server Component  ──▶ lib/queries ──▶ Prisma ──▶ Postgres (Supabase)
         ──▶ Server Action     ──▶ lib/validation (Zod) ──▶ Prisma
         ──▶ /api/auth/[...all] ──▶ Better Auth
```

## Route groups

| Group | Path | Who | Notes |
| --- | --- | --- | --- |
| `(marketing)` | `/`, `/properties`, `/agents`, `/demo`, `/case-study` | Everyone | Public, indexable, cached reads. |
| `(auth)` | `/login`, `/signup`, `/forgot-password` | Anonymous | Shared centred layout. |
| `agent/(protected)` | `/agent/*` | AGENT | Own listings, enquiries, profile. |
| `admin/(protected)` | `/admin/*` | ADMIN | Moderation, agents, users, audit, upload. |
| `api` | `/api/auth`, `/api/demo/reset` | — | Better Auth handler and the demo reset hook. |

`(protected)` is a layout that calls `requireAgent()` / `requireAdmin()` once for
its subtree. Actions still guard individually — see
[authorization.md](./authorization.md).

## Data access

`src/lib/listing/queries.ts`, `src/lib/agent/dashboard.ts` and
`src/lib/admin/*` hold every query. Components do not call Prisma directly, so
the same listing projection cannot drift between the card grid, the detail page
and the agent table.

Two details worth knowing:

- **The pooler is shared.** Supabase's transaction pooler serves every tenant
  from one pool, so [`prisma.ts`](../src/lib/prisma.ts) caps the client at 5
  connections and retires idle sockets after 10 s. Pinning `min` connections or
  long idle timeouts makes the pooler close sockets that `pg` still believes are
  healthy, which surfaces as P1017 mid-request.
- **Reads are batched.** A cross-region round trip costs ~150 ms, so a page that
  needs a listing, its images and its agent issues one `Promise.all` rather than
  three sequential awaits. The detail page renders its cover in HTML and streams
  similar listings behind `<Suspense>`.

## Caching

Public listing reads go through
[`public-cache.ts`](../src/lib/listing/public-cache.ts): a 15-second in-process
TTL map keyed by listing id, cleared explicitly (`clearPublicCache("listing:")`)
by every mutation that changes a listing.

`unstable_cache` is deliberately *not* used: without the Cache Components flag
its `revalidate` is ignored, which silently serves unpublished listings. The
regression is covered by [`public-cache.test.ts`](../src/lib/listing/public-cache.test.ts).

## Validation

Every server action parses its input with a schema from
[`src/lib/validation`](../src/lib/validation) before it writes, using the same
schema the form renders from. Field errors come back as
`{ field: message }`, and the shared field primitives turn that into
`aria-invalid` plus a `role="alert"` message under the offending input.

[`actions.test.ts`](../src/lib/validation/actions.test.ts) walks `src/app`,
finds every `"use server"` module and fails if an exported action lacks a
`safeParse` or a guard — delegation to a local helper is followed one hop, so
`archiveListing` is covered by the guard inside `setArchived`.

## Images

Listing photos are Cloudinary URLs. The four social-preview and hero images are
vendored into `public/` rather than hot-linked, so the LCP element is served from
the same origin as the HTML. `images.remotePatterns` is scoped to the
Cloudinary host; `images.qualities` lists the widths the app actually requests,
because Next 16 silently coerces unlisted `quality` values to 75.

## Demo mode

`users.isDemo` and `listings.isDemo` mark the showcase dataset. Three accounts
(`/demo`) sign in through the real auth endpoint, a banner explains the
read-only state, and `isDemoSessionUser` short-circuits every mutation with a
plain-language refusal. `npm run demo:reset` restores the dataset idempotently;
the nightly cron calls `POST /api/demo/reset` with a shared secret.

## Testing

| Layer | Tool | What it covers |
| --- | --- | --- |
| Unit | Vitest (`npm test`) | Schemas, formatters, filter parsing, status transitions, cache TTL, action boundary audit. |
| Manual / browser | Playwright via the agent | Sign-in, create/edit listings, moderation, demo refusals — recorded in the plan. |

CI runs lint → typecheck → unit tests → production build on every PR to `main`
([`ci.yml`](../.github/workflows/ci.yml)).

## Known trade-offs

- The rate limiter is per-process (`lib/listing/inquiry.ts`). A multi-instance
  deployment needs a shared counter; on one demo instance the sliding window is
  enough, and the 429 message is honest about the wait.
- Transactions are not used across "write row + write audit log". The audit row
  is written by the same action immediately after the update, and a failure is
  surfaced rather than swallowed — see
  [decisions/0002](./decisions/0002-audit-in-action.md).
