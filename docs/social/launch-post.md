# Launch copy

Ready-to-paste text for the repo metadata and the first post. Numbers are the measured ones in
the [README](../../README.md#metrics); if they change, change them here too.

## Repository metadata

**Description**

> A moderated property marketplace: buyers search verified listings, agents work their own
> listings and enquiries, admins approve the catalogue and every decision is audited.
> Next.js 16 · PostgreSQL · Prisma · Better Auth.

**Topics**

```
nextjs  nextjs-app-router  react  typescript  prisma  postgresql  better-auth
tailwindcss  zod  real-estate  marketplace  rbac  audit-log
```

**Social preview:** [`og-1200x630.png`](og-1200x630.png) — rendered from the app's own
`opengraph-image` route, so it matches the product rather than a hand-made banner.

**Release:** `v1.0.0-portfolio` (tagged locally; publish it once the repo is pushed).

## LinkedIn

> Most property listings in Nigeria are posted by anyone, and nobody can tell you who vetted
> them. Buyers pay for that in wasted calls and wasted viewings.
>
> I built Alara Estate to model the opposite: **nothing reaches the public site until an admin
> approves it.** Three personas, one database.
>
> · Buyers filter, open, enquire, save — no account needed.
> · Agents get a real workspace: KPIs from their own rows, listing actions with an audit trail,
>   an enquiry inbox with a status pipeline.
> · Admins get a moderation queue, agent verification, an audited role change, and an
>   append-only audit log that records the reason, not just the change.
>
> Some of what I had to get right rather than fake:
>
> → Authorization in three layers (edge cookie check, server guard, ownership in the query) —
>   a guarded page does not protect the action behind it.
> → One Zod schema per action, shared with the form that renders the errors, plus a test that
>   walks the source tree and fails the build if an action loses its guard or its schema.
> → Moderation as a state machine, unit-tested, with "verified agent" as a precondition for
>   publishing.
> → A read-only demo on top of real auth, so a reviewer can be inside a populated admin
>   dashboard in two clicks without being able to damage the shared data.
>
> 91 unit tests, clean typecheck and lint, LCP 1.58 s on a throttled mobile profile.
>
> Repo: github.com/AYG3/real-listings — the `/demo` route is the fastest way in.

## Short version (X / Bluesky)

> Built a property marketplace where nothing is listed until a human approves it.
>
> 3 personas: buyers search verified listings, agents work their own enquiries, admins moderate
> with an append-only audit log.
>
> Next.js 16 · Prisma · Better Auth · 91 tests · LCP 1.58 s
> github.com/AYG3/real-listings

## Notes for the reader of this file

- The demo links in the README point at `localhost:3000` because the project is not deployed.
  Swap them for the deployed URL in one place once Vercel is wired.
- Nothing here claims a Lighthouse score. If you run Lighthouse later, add the number to the
  README metrics table *and* to the plan's Phase 3 criterion, and say which preset produced it.
