# Case study — Alara Estate

STAR format, written for a reviewer who has fifteen minutes and will not clone the repo.

---

## Situation

Nigerian property listing sites share a failure mode: anyone can post anything, and nothing
records who vouched for it. A buyer scrolling a search results page has no way to tell a
verified agent's house from a duplicate posted last night by an account that will be gone next
week. The cost lands on the buyer — wasted calls, wasted viewings, wasted weeks — and the
platform has no incentive to fix it because listings are the product.

I wanted a portfolio project that was not another CRUD clone, and this was the honest problem
to model: **a marketplace where publication is a decision, not a form submission.**

## Task

Build a working, three-sided marketplace where:

1. A listing reaches the public site **only after** an admin approves it.
2. An agent can only ever touch **their own** listings and enquiries.
3. Every administrative decision is **reconstructible**: who, what, from which state to which,
   and why.
4. A reviewer can evaluate the whole thing **without creating an account** — and without being
   able to break the data the next reviewer will see.

Constraints I set myself: one PostgreSQL database, no mock data in the happy path, real auth
(not a stub role in a cookie), and every claim in the README backed by a measurement or a test
that would fail if the claim stopped being true.

## Action

**Data model.** `User` (BUYER / AGENT / ADMIN) → `Listing` → `ListingImage`; `Inquiry` on a
listing with an optional buyer; `SavedListing`; `AuditLog`. Type-specific facts (bedrooms,
title type, survey plan) live in a normalised `attributes jsonb` column validated by one Zod
schema, which keeps the feed query to a single row per listing — [ADR 0001](decisions/0001-json-attributes.md).

**Authorization in three layers.** `proxy.ts` does an optimistic cookie check at the edge;
`requireAgent` / `requireAdmin` in the guards answer the role question on the server;
ownership is enforced in the query itself (`where: { agentId: session.user.id }`), with
`notFound()` on a miss so ids cannot be enumerated. Actions are guarded individually, because
a guarded page does not protect the endpoint behind it — [docs/authorization.md](authorization.md).

**Moderation as a state machine.** `DRAFT → PUBLISHED → UNDER_OFFER → SOLD | RENTED`, with
`ARCHIVED` reversible back to `DRAFT`. The transitions are a data table in
`src/lib/listing/transitions.ts`, unit-tested, and publishing additionally requires
`agentStatus = VERIFIED`. Rejections and change requests carry a reason that lands on the
agent's own listing card.

**Audit by construction.** Every admin mutation calls `recordAudit` in the same action with
actor, target, from/to status and the typed reason. I chose the action over a database trigger
because a trigger cannot know why — the trade-off is documented rather than hidden —
[ADR 0002](decisions/0002-audit-in-action.md).

**One validation layer.** `createListing` originally wrote listings with no validation: a blank
price became ₦0 and a blank title became "Untitled property". Every action now parses a schema
from `src/lib/validation` before writing, the same schema the form renders from, and field
errors come back as `aria-invalid` + a `role="alert"` message under the offending input. A test
walks `src/app`, finds every `"use server"` module and fails the build if an exported action
lacks a guard or a parse.

**Performance where it actually mattered.** Profiling the detail page showed the render
dominated by cross-region round trips, not by payload. I batched dependent reads into one
`Promise.all`, moved "similar listings" behind `<Suspense>`, and on the landing page moved the
stats query out of the hero so the `<h1>` — the LCP element — stops waiting on the database.
Card images dropped to quality 62: 380 KB of images instead of 540 KB, quantile LCP 1.58 s on a
throttled 390 px profile (from 2.27 s).

**Demo mode that cannot lie.** `/demo` signs three real accounts in through the real auth
endpoint — the demo admin genuinely has `role = ADMIN`, so the demo exercises the production
authorization path rather than a mock. Read-only behaviour is a separate `isDemo` predicate
applied at all 18 mutation sites, with a banner explaining the state, and an idempotent
`npm run demo:reset` behind a secret-guarded endpoint for the nightly cron.

## Result

| | |
| --- | --- |
| **Scope** | 40+ routes and screens across three portals; 13 Prisma models; hand-written migrations applied through the `pg` adapter |
| **Tests** | 91 unit tests; a boundary audit that fails when an action loses its guard or schema |
| **Quality gates** | `tsc`, `eslint --max-warnings=0`, Vitest and a production build are clean; CI runs all four |
| **Landing-page LCP** | 1 584 ms median on a 390 px / 4× CPU / 1.6 Mbps profile — measured, not projected |
| **Payload** | 1 053 KB decoded, 380 KB of it images, 35 requests |
| **Reviewer path** | homepage → `/demo` → admin dashboard in **two clicks**; a 90-second script in [demo-script.md](demo-script.md) covers the full pipeline |

What a reviewer can verify in five minutes without reading code: publish a draft as the demo
admin and watch it appear on the public site; try to change a role as a demo account and get a
plain-language refusal instead of a stack trace; open the audit log and see every decision from
the last session with its reason; sign in as an agent and confirm the other agent's listing is
a 404.

**What I would do next:** deploy it (the workflow exists, the credentials do not), add Playwright
for the five critical paths, and move the per-process rate limiter and cache to Redis so the
guarantees survive more than one instance. Those are listed, with reasons, in the
[roadmap](../README.md#roadmap).

---

## CV bullets

Drafted from the numbers above; adjust the framing to the role.

- Designed and built a three-sided property marketplace (Next.js 16 App Router, PostgreSQL,
  Prisma 7, Better Auth) with a moderation gate that makes admin approval the only path to
  publication, and a three-layer authorization model enforced in the proxy, the route guards
  and every server action.
- Cut landing-page LCP from 2.27 s to a 1.58 s median on a throttled mobile profile (390 px,
  4x CPU, 1.6 Mbps) by moving the hero's database dependency off the critical path and
  streaming the below-the-fold sections; trimmed image payload 30% with no visible change.
- Replaced six divergent ad-hoc validators with one shared Zod layer and added a test that walks
  the source tree to fail the build when a server action lacks a guard or a schema, taking the
  suite from 6 to 91 tests and closing an unvalidated write path that could persist ₦0 listings.
- Built an append-only audit trail written by the same action that performs each administrative
  change, and documented the transactional trade-off in an ADR rather than hiding it.
- Shipped a read-only demo mode on top of real authentication (three one-click personas,
  18 guarded mutation sites, idempotent nightly reset) so reviewers can evaluate every screen
  in two clicks without being able to damage the shared dataset.
