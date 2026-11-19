

type SessionUser = { email?: string | null; isDemo?: boolean | null };

/**
 * Single source of truth for "is this a read-only demo session?".
 *
 * The database flag is authoritative; the email list exists so the guard still
 * works for a session object that predates the column being loaded.
 */
export function isDemoSessionUser(user: SessionUser | null | undefined): boolean {
  if (!user) return false;
  if (user.isDemo === true) return true;

  if (process.env.DEMO_MODE !== "true") return false;
  const configured = (process.env.DEMO_ACCOUNT_EMAILS ?? "demo-admin@alara.ng,demo-agent@alara.ng,demo-buyer@alara.ng")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user.email && configured.includes(user.email.toLowerCase()));
}

export const DEMO_READ_ONLY_MESSAGE =
  "This is a read-only demo account — every screen is open, but nothing can be changed. The data resets nightly.";

/** For server actions: returns a friendly error result instead of throwing. */
export function demoRefusal(): { status: "error"; message: string } {
  return { status: "error", message: DEMO_READ_ONLY_MESSAGE };
}
