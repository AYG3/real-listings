/**
 * Demo accounts are read-only by contract: a reviewer may click everything, but
 * nothing they click may change the data other reviewers see next.
 *
 * The demo account itself lands in Phase 6. Until then this hook is the single
 * place that answers "may this actor destroy state?", so enabling demo mode is a
 * configuration change rather than a hunt through every action.
 */
export function isDemoUser(user: { email?: string | null }): boolean {
  if (process.env.DEMO_MODE !== "true") return false;

  const configured = (process.env.DEMO_ACCOUNT_EMAILS ?? "demo@alara.ng")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user.email && configured.includes(user.email.toLowerCase()));
}

/** Message shown when a demo account tries something destructive. */
export const DEMO_BLOCKED_MESSAGE =
  "This is a read-only demo account. Sign in with an admin account to change data.";
