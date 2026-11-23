import {
  BadgeCheck,
  Building2,
  Inbox,
  LayoutDashboard,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AccountRole = "ADMIN" | "AGENT" | "BUYER";

export const roleLabels: Record<AccountRole, string> = {
  ADMIN: "Admin",
  AGENT: "Agent",
  BUYER: "Buyer",
};

export function normaliseRole(role?: string | null): AccountRole {
  return role === "ADMIN" || role === "AGENT" ? role : "BUYER";
}

export type PortalLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** Shared by the desktop account menu and the mobile navigation sheet. */
export const portalLinks: Record<AccountRole, PortalLink[]> = {
  ADMIN: [
    { label: "Admin overview", href: "/admin/overview", icon: LayoutDashboard },
    { label: "Moderation queue", href: "/admin/moderation", icon: BadgeCheck },
    { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  ],
  AGENT: [
    { label: "Agent dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
    { label: "My listings", href: "/agent/listings", icon: Building2 },
    { label: "Enquiries", href: "/agent/enquiries", icon: Inbox },
  ],
  BUYER: [],
};
