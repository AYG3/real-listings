# Authorization

Three layers, each with a different job. A request passes all three before it can
change data.

| Layer | Where | Question it answers | Failure mode |
| --- | --- | --- | --- |
| 1. Edge gate | [`src/proxy.ts`](../src/proxy.ts) | Does this request even have a session cookie? | Redirect to the portal login, before any React renders. |
| 2. Guard | [`src/lib/auth/guards.ts`](../src/lib/auth/guards.ts) | Which role may run this code? | `redirect("/")` for pages, a typed error for actions. |
| 3. Ownership + schema | Server actions, Prisma queries | May *this* user touch *this* row, and is the input valid? | Query scoped by `agentId`, `safeParse` rejects the payload. |

## Why three layers

The edge gate is optimistic: it only looks for a Better Auth cookie, because
middleware runs on every request and must not query the database. It is a
performance and UX measure, never the security boundary — a forged cookie gets
past it.

The guard is the role boundary. `requireAuth(["ADMIN"])` calls
`auth.api.getSession()`, which validates the cookie against the `session` table
and loads the user, then compares `user.role`. Every admin page and every admin
action calls `requireAdmin()`; every agent page and action calls
`requireAgent()`. There is no route that relies on the layout alone, because
layouts do not run for server actions.

Ownership is the layer people forget. Being an AGENT is not permission to edit
*any* listing — it is permission to edit *your own*. So every agent query carries
`agentId: session.user.id` in its `where` clause, and a miss returns "not found"
rather than "forbidden" so the endpoint does not confirm that a row exists. The
same pattern scopes enquiries through `listing.agentId`.

## The one predicate the role model does not cover

Demo accounts are real users with real roles — `demo-admin@alara.ng` genuinely
has `role = ADMIN`, which is what makes the demo prove the real authorization
path rather than mock it. Read-only behaviour is a *separate* predicate,
[`isDemoSessionUser`](../src/lib/demo/guard.ts), checked at all 18 mutation
sites. It rides on the session via Better Auth's `additionalFields`, so the
guard costs no extra query.

## Rules that fall out of this

- A server action is never safe just because its page was guarded: actions are
  separate HTTP endpoints. Guard inside the action.
- Redirects are for pages; actions return `{ status: "error", message }` so the
  form can explain itself.
- `notFound()` is preferred over `forbidden()` for cross-tenant reads, so
  agents cannot enumerate other agents' listing ids.
- Every action parses its input with a schema from
  [`src/lib/validation`](../src/lib/validation) **before** it writes. This is
  enforced by [`actions.test.ts`](../src/lib/validation/actions.test.ts), which
  fails the build if an action gains a write without a parse or a guard.
