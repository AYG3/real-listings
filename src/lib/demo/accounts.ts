export type DemoRole = "visitor" | "agent" | "admin";

export type DemoIdentity = {
  role: DemoRole;
  email: string;
  password: string;
  label: string;
  next: string;
  headline: string;
  blurb: string;
  highlights: string[];
};

/**
 * The three one-click demo identities. They are ordinary accounts with ordinary
 * roles, marked `isDemo` in the database so every mutation refuses them. The
 * password ships in the page source on purpose — it is a read-only demo
 * account, and a reviewer should never have to type it.
 */
export const demoIdentities: DemoIdentity[] = [
  {
    role: "visitor",
    email: "demo-buyer@alara.ng",
    password: "DemoReadOnly1!",
    label: "Browse as a visitor",
    next: "/properties",
    headline: "Visitor",
    blurb: "Search, filter, open a listing, save a property.",
    highlights: [
      "URL-synced filters that survive a reload",
      "Keyboard-operable gallery and JSON-LD",
      "Saved properties survive sign-in",
    ],
  },
  {
    role: "agent",
    email: "demo-agent@alara.ng",
    password: "DemoReadOnly1!",
    label: "Open the agent workspace",
    next: "/agent/dashboard",
    headline: "Agent",
    blurb: "Live dashboard, listing actions and the enquiry inbox.",
    highlights: [
      "KPIs aggregate your own rows only",
      "Publish / unpublish / archive with an audit trail",
      "Enquiry status machine with reply notes",
    ],
  },
  {
    role: "admin",
    email: "demo-admin@alara.ng",
    password: "DemoReadOnly1!",
    label: "Open the admin control tower",
    next: "/admin/overview",
    headline: "Admin",
    blurb: "Moderation queue, agent verification and the audit log.",
    highlights: [
      "Approve a listing and watch it go live",
      "Verify an agent with a reason on record",
      "Every decision lands in the audit log",
    ],
  },
];

export function getDemoIdentity(role: DemoRole) {
  return demoIdentities.find((identity) => identity.role === role);
}
