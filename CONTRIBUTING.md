# Contributing

This is a portfolio project rather than a team repository, so treat the notes
below as the house rules rather than a process with an SLA.

## Getting a working copy

```bash
npm install
cp .env.example .env.local     # set DATABASE_URL and BETTER_AUTH_SECRET
npm run db:migrate
npm run db:seed
npm run dev
```

Seeded accounts are listed in [the README](README.md#seeded-accounts-local-only).
`npm run demo:reset` restores the showcase dataset if you change something you
want back.

## Before opening a pull request

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

CI runs the same four steps, in that order, on every pull request to `main`.

If you touched a layout, a form or a colour, also run the accessibility audit against a
running build — it needs Chrome and the seeded accounts:

```bash
npm run build && npm start          # in one terminal
BASE_URL=http://localhost:3000 npm run a11y   # in another
```

## Conventions

- **Server actions parse before they write.** Every action gets a schema from
  [`src/lib/validation`](src/lib/validation) and a guard (`requireAgent`,
  `requireAdmin`, or an explicit session check). The boundary test enforces it —
  if you add an action without one, `npm test` fails.
- **Queries live in `src/lib/*`**, not in components. One projection per
  surface, so the card grid and the detail page cannot disagree.
- **Administrative changes write an audit row** through `recordAudit`, in the
  same action, with the reason the actor supplied.
- **Owner-scoped reads use `notFound()`,** not a forbidden page, so ids cannot
  be enumerated.
- **Commit messages** follow Conventional Commits (`feat:`, `fix:`, `refactor:`,
  `docs:`, `test:`, `chore:`), with the body explaining the *why*.

## Reporting a problem

Open an issue with the page, the role you were signed in as, and what you
expected. Screenshots help; server logs help more.
