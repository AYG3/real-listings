# 90-second demo script

The point of the recording is to show a working marketplace with a trust story —
not to tour every screen. Two routes matter: the catalogue, then the admin queue.

Before recording: run `npm run demo:reset` so the counts are the seeded ones
(20 demo listings, 18 published, 3 demo accounts), and open `/demo`.

| Time | Do this | Say this |
| --- | --- | --- |
| 0:00 | Home page | "A three-sided marketplace: buyers, agents, admins. Everything is seeded and the demo accounts are read-only." |
| 0:10 | Click **Take the demo** → the Visitor card | "One click, no signup. The demo signs in through the same auth endpoint a real user hits." |
| 0:20 | `/properties`: set State = Lagos, then reload the page | "Filters are in the URL, so the state survives a reload and can be shared." |
| 0:30 | Open *4-bedroom duplex with a private garden*; arrow through the gallery, then press Escape | "Keyboard-operable gallery, JSON-LD, verified agent, guest enquiry — no account needed." |
| 0:40 | Back to `/demo`, click **Agent** | "Same app, different role. This dashboard aggregates only this agent's rows — 6 listings, 290 views." |
| 0:50 | Agent → My Listings: click **Unpublish** on a live listing, then **Publish** it again | "State transitions are an explicit map in a server action, ownership-scoped, with a toast on success." |
| 1:00 | Back to `/demo`, click **Admin** | "The trust story." |
| 1:08 | Admin → Moderation: type a reason, click **Request changes** | "Rejections carry a reason that lands on the agent's own card." |
| 1:20 | Admin → Audit log | "Every decision is one row: actor, target, from → to, reason." |
| 1:28 | Point at the amber banner | "This account is read-only — try to archive something and it explains why instead of failing." |
| 1:35 | `/case-study` | "Problem, decisions with trade-offs, and what I would do next." |

Keep the mouse slow: the audience reads the labels, not your clicks.
