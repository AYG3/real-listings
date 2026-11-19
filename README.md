# Alara Estate

A three-sided property marketplace for Nigeria: buyers discover verified houses and land, agents manage their listings and enquiries, and admins moderate the catalogue and verify agents.

Built with Next.js 16 (App Router), PostgreSQL, Prisma 7, Better Auth and Cloudinary.

> **Status:** actively being built toward a portfolio-ready release. Foundation, design system, public discovery, the enquiry/save loop, the agent workspace and the admin control tower (Phases 0–5) are complete; demo mode and the test suite are next. See [`plans/01-portfolio-readiness-plan.md`](plans/01-portfolio-readiness-plan.md) for the phased roadmap.

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16, App Router, React 19 | Server components keep data fetching on the server and the client bundle small. |
| Language | TypeScript (strict) | Type safety across Prisma models, server actions, and UI props. |
| Database | PostgreSQL | Relational integrity for users, listings, images and enquiries. |
| ORM | Prisma 7 (`prisma-client` generator + `pg` adapter) | Typed queries and migrations. |
| Auth | Better Auth | Email/password + Google OAuth, sessions in Postgres, role-aware guards. |
| Media | Cloudinary via `next-cloudinary` | Direct browser uploads; only the secure URL and public id reach the database. |
| UI | Tailwind CSS v4, `lucide-react`, `sonner` | Fast, consistent, accessible primitives. |
| Validation | `zod` | One schema per mutation; server actions reject malformed input before touching the database. |

## What works today

- **Public discovery:** `/properties` with URL-synced filters (`q`, intent, type, state, city, price band, beds, sort), pagination and active-filter chips. Every combination is a shareable, reloadable URL that works without JavaScript.
- **Listing detail pages** at `/properties/[slug]` with keyboard-operable gallery, type-specific facts (beds/baths/sqm or plots/title/survey), description, similar listings, verified-agent card and JSON-LD.
- **Guest enquiries:** anyone can message the agent without an account. Validated with zod, honeypot-protected, rate limited to 5/hour per IP, and stored in Postgres (`buyerId` is null for guests, set when signed in).
- **Save properties:** optimistic save button; guests keep saves in `localStorage` and they merge into `SavedListing` on the next signed-in view.
- **View tracking:** each detail render increments `viewCount` and records a `ListingView` after the response is sent.
- **Agent directory** at `/agents` and per-agent profiles at `/agents/[id]`, both reading live data.
- **Preset routes** `/buy`, `/rent`, `/land` that reuse the results page instead of duplicating queries.
- **Real counts on the homepage** (`listing.count` + `groupBy`) and a hero search that actually navigates.
- Email/password and Google sign-in through one role-aware `/login` (a portal deep link like `/admin/overview` sends you there with the right gate).
- Role-based protection for the agent (`/agent/*`) and admin (`/admin/*`) portals, enforced in the proxy, the layout **and** every server action.
- **Agent workspace** at `/agent/dashboard`: live counts, views, enquiry rate, a 14-day views sparkline and an activity feed, all aggregated from the agent's own rows.
- **Agent listings** with search, status/type filters and sorting, plus working row actions — Edit, Publish, Unpublish, Mark under offer, Mark sold, Archive, Restore — as guarded server actions. Verified agents can publish directly; unverified ones stay in review.
- **Listing editing** at `/agent/listings/[id]/edit`, including photo reordering, "set as cover" and removal, capped at 12 images.
- **Enquiry inbox** at `/agent/enquiries`: filters, search, buyer contact details, reply notes, and `NEW → CONTACTED → VIEWING_SCHEDULED → CLOSED` transitions.
- **Agent profile** editing (name, phone, agency, bio, avatar) with the verification state shown.
- Agent listing creation with Cloudinary image upload, ordered images and a cover image. New submissions from unverified agents enter moderation as drafts.
- Admin listing table with search, status filters, and a listing detail view.
- **Admin control tower** at `/admin/overview`: real listing/agent/buyer/enquiry counts, a 30-day submissions chart and the latest decisions from the audit log.
- **Moderation queue** at `/admin/moderation`: approve a draft to publish it, or reject / request changes with a reason that lands on the agent's listing card.
- **Agent verification** in the same queue: verify or reject an account; the verified badge on the public profile reads the same column.
- **Audit log** at `/admin/audit`: who changed what, from which state to which, with the reason attached.
- A single design system: one brand source (`src/lib/brand.ts`), one token palette (`globals.css`), and shared primitives in `src/components/ui/`.
- `sitemap.xml` and `robots.txt` generated from the live catalogue.

## In progress

- Admin user table with role changes, and confirm-to-type dialogs for destructive actions.
- Buyer `/account` pages for saved listings and enquiries.
- One-click, read-only demo mode for reviewers (Phase 6).
- Automated tests (Phase 7) — 6 unit tests exist (`npm test`); CI runs lint, typecheck, tests and build.

## Getting started

```bash
# 1. Install dependencies (also generates the Prisma client)
npm install

# 2. Create your local env file
cp .env.example .env.local

# 3. Apply the schema
npm run db:migrate

# 4. Create the ADMIN / AGENT / BUYER accounts
npm run db:seed

# 5. Start the app
npm run dev
```

Open <http://localhost:3000>.

> If Prisma's engine download is blocked in your environment (some sandboxed or locked-down
> machines restrict `~/.cache/prisma`), `npm install` will print a notice and continue. Run
> `npm run db:generate` once your environment allows it — the production build also generates
> the client.

### Environment variables

All variables are documented in [`.env.example`](.env.example). The minimum needed to run locally is `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`. Google OAuth and Cloudinary are optional — sign-in falls back to email/password and image upload is disabled without Cloudinary credentials.

> **Supabase connection modes matter.** Point `DATABASE_URL` at the **transaction** pooler (`...:6543/...?pgbouncer=true`). The session pooler on port 5432 allows only a handful of clients and will throw `(EMAXCONNSESSION) max clients reached` once dev reloads or a few serverless instances open pools. Use the session/direct connection (`DIRECT_URL`) only for migrations.

> **Keep the client pool short-lived.** The pool in [`src/lib/prisma.ts`](src/lib/prisma.ts) caps at 5 connections and retires idle ones after 10 seconds. Do not pin `min` connections or hold sockets idle for minutes: the pooler closes what it considers idle, and a connection it closed still looks healthy to `pg` until the next query fails with `P1017 ConnectionClosed`. The cost of reconnecting is real (~0.7 s TLS handshake from a different region), which is why the read paths batch their queries instead of spreading them over several round trips — see [the Phase 3 latency notes](plans/01-portfolio-readiness-plan.md#phase-3--lcp-and-render-latency).

### Seeded accounts (local only)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@alara.ng` | `AlaraAdmin1!` |
| Agent | `agent@alara.ng` | `AlaraAgent1!` |
| Buyer | `buyer@alara.ng` | `AlaraBuyer1!` |
| Agents (showcase) | `chidi@alara.ng`, `grace@alara.ng`, `musa@alara.ng` | `AlaraAgent1!` |

The seed also creates **18 showcase listings** (16 published, 2 drafts) across Lagos, FCT, Rivers, Oyo, Enugu and Kano — houses and land, sale and rent — plus one or more photos each. Listings upsert by slug, so re-running the seed resets the demo content rather than duplicating it.

Sign in at `/login`. A deep link to a portal (`/admin/overview`, `/agent/dashboard`) redirects there with the required role pre-selected, and a mismatched role is rejected with an inline error. The seed is idempotent — running `npm run db:seed` again will not duplicate users.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Generate the Prisma client and build for production. |
| `npm start` | Run the production build. |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules). |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Vitest unit tests (`src/**/*.test.ts`). |
| `npm run db:migrate` | Create and apply a migration in development. |
| `npm run db:seed` | Seed the ADMIN / AGENT / BUYER accounts (idempotent). |
| `npm run db:studio` | Open Prisma Studio. |

## Project structure

```text
prisma/
  schema.prisma          Data model (users, listings, images, enquiries, saved listings)
  seed.ts                Idempotent accounts + showcase listings
  seed-listings.ts       The showcase dataset (agents + 18 listings)
src/
  app/
    (auth)/              One /login, /signup, /forgot-password
    (marketing)/         Public site: home, /properties, /properties/[slug], /agents, /agents/[id]
    admin/               Admin portal (protected area; login redirects to /login)
    agent/               Agent portal (protected area + become-an-agent)
    api/auth/            Better Auth handler
  components/
    ui/                  Design-system primitives (Button, Field, Card, Badge, Price, …)
    auth/                AuthShell, CredentialsForm, Google sign-in
    upload/              Cloudinary widget
  lib/
    brand.ts             Single source for name, locale, currency, colours
    format.ts            formatPrice / formatRelativeTime / slugify / initials
    status.ts            Listing + inquiry status labels and tones
    auth/                Better Auth config, client, role guards
    admin/               Admin queries and listing mutations
  proxy.ts               Security headers + optimistic portal gate
  prisma/generated/      Generated Prisma client (not committed)
```

## Security notes

- Route access is enforced in the proxy (optimistic), in each portal layout **and** in every page, because a layout-only guard still streams the segment's payload before redirecting.
- **Every** listing mutation re-checks the session role before touching the database.
- Server-only secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `CLOUDINARY_API_SECRET`) are never exposed to the client bundle.
- Security headers (frame options, referrer policy, permissions policy, HSTS in production) are applied by `src/proxy.ts`.

## Deployment

CI runs lint, typecheck and build on every push and PR ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).
A successful run on `main` then deploys to Vercel ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

**One-time setup**

1. Create a Vercel project from this repo and note the org and project IDs
   (`vercel link` writes them to `.vercel/project.json`).
2. Add the runtime env vars in **Vercel → Project → Settings → Environment Variables**:
   `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (the production URL),
   `TRUSTED_ORIGINS`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`, and optionally `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
   See [`.env.example`](.env.example) for what each one does.
3. Add three repository secrets: `VERCEL_TOKEN` (from <https://vercel.com/account/tokens>),
   `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`.
4. Run `npm run db:migrate` and `npm run db:seed` once against the production database
   (locally, with `DIRECT_URL`/`DATABASE_URL` pointed at it).

After that, every merge to `main` that passes CI ships automatically.

## Roadmap

The full plan — including the design system, discovery experience, moderation pipeline, demo mode, testing strategy, and portfolio packaging — lives in [`plans/01-portfolio-readiness-plan.md`](plans/01-portfolio-readiness-plan.md).
