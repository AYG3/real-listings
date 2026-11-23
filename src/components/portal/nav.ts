import {
  Building2,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  ScrollText,
  Upload,
  UserCircle,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PortalNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Shared by the desktop sidebar and the mobile drawer. Lives in a client-safe
 * module so the shell can resolve icons without serialising them across the
 * server/client boundary.
 */
export const adminNavItems: PortalNavItem[] = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Listings", href: "/admin/listings", icon: Building2 },
  { label: "Agents", href: "/admin/agents", icon: Users },
  { label: "Users", href: "/admin/users", icon: UserCog },
  { label: "Moderation", href: "/admin/moderation", icon: ListChecks },
  { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  { label: "Upload", href: "/admin/upload", icon: Upload },
];

export const agentNavItems: PortalNavItem[] = [
  { label: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
  { label: "My listings", href: "/agent/listings", icon: Home },
  { label: "Enquiries", href: "/agent/enquiries", icon: MessageSquare },
  { label: "Profile", href: "/agent/profile", icon: UserCircle },
];

/** Longest matching link wins, so nested routes name their section. */
export function sectionTitle(
  pathname: string,
  items: PortalNavItem[],
  fallback: string,
) {
  const match = items
    .filter(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];

  return match?.label ?? fallback;
}
