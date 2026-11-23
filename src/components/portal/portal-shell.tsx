"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import { ExternalLink, Menu as MenuIcon } from "lucide-react";
import { brand } from "@/lib/brand";
import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import { buttonStyles } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { normaliseRole, roleLabels } from "@/lib/auth/portal-links";
import { adminNavItems, agentNavItems, sectionTitle } from "./nav";

export type PortalUser = {
  name: string;
  email: string;
  role?: string | null;
  isDemo?: boolean | null;
};

type PortalShellProps = {
  portal: "admin" | "agent";
  user: PortalUser;
  children: ReactNode;
};

function NavLinks({
  items,
  pathname,
  onNavigate,
}: {
  items: typeof adminNavItems;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ label, href, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold transition-colors",
                active
                  ? "bg-emerald-50 text-forest-700"
                  : "text-ink-700 hover:bg-ivory-100 hover:text-ink-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Identity({ user, isDemo }: { user: PortalUser; isDemo: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-xs font-bold text-forest-800",
          isDemo && "ring-2 ring-amber-400 ring-offset-2",
        )}
        aria-hidden="true"
      >
        {initials(user.name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink-900">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-500">{user.email}</p>
      </div>
    </div>
  );
}

function IdentityMeta({
  roleLabel,
  isDemo,
}: {
  roleLabel: string;
  isDemo: boolean;
}) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
      <span className="rounded-full bg-forest-700/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-forest-800">
        {roleLabel}
      </span>
      {isDemo ? (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
          Demo
        </span>
      ) : null}
    </div>
  );
}

function PortalActions({ onSignedOut }: { onSignedOut?: () => void }) {
  return (
    <div className="space-y-1.5">
      <Link
        href="/"
        className={buttonStyles({
          variant: "ghost",
          size: "md",
          className: "w-full",
        })}
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        View public site
      </Link>
      <SignOutButton
        variant="ghost"
        size="md"
        className="w-full"
        onSignedOut={onSignedOut}
      />
    </div>
  );
}

/**
 * Shared chrome for the admin and agent portals: a sticky sidebar from `lg`,
 * a 56px app bar and a modal drawer below it. The drawer is the single mobile
 * navigation surface, so the app bar never competes with page content for
 * space. Background content is `inert` while it is open.
 */
export function PortalShell({ portal, user, children }: PortalShellProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const navItems = portal === "admin" ? adminNavItems : agentNavItems;
  const portalLabel = portal === "admin" ? "Admin" : "Agent";
  const title = sectionTitle(pathname, navItems, portalLabel);
  const roleLabel = roleLabels[normaliseRole(user.role)];
  const isDemo = user.isDemo === true;
  const closeNav = () => setNavOpen(false);

  return (
    <div className="flex min-h-svh bg-surface">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink-900/10 bg-white lg:sticky lg:top-0 lg:flex lg:h-svh">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-ink-900/10 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-control bg-forest-700 text-sm font-bold text-white">
            {brand.name.charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink-900">
              {brand.name}
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-500">
              {portalLabel}
            </span>
          </span>
        </div>

        <nav aria-label={`${portalLabel} navigation`} className="flex-1 px-3 py-4">
          <NavLinks items={navItems} pathname={pathname} />
        </nav>

        <div className="border-t border-ink-900/10 p-4">
          <Identity user={user} isDemo={isDemo} />
          <IdentityMeta roleLabel={roleLabel} isDemo={isDemo} />
          <div className="mt-3">
            <PortalActions />
          </div>
        </div>
      </aside>

      <div
        className="flex min-w-0 flex-1 flex-col"
        inert={navOpen || undefined}
      >
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-ink-900/10 bg-white/95 px-2 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-expanded={navOpen}
            aria-controls="portal-navigation"
            aria-label="Open navigation"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-ink-700 transition-colors hover:bg-ivory-100"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink-900">{title}</p>
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-500">
              {portalLabel}
            </p>
          </div>

          <span className="mr-2 hidden shrink-0 rounded-full bg-forest-700/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-forest-800 sm:block">
            {roleLabel}
          </span>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <Sheet
        open={navOpen}
        onClose={closeNav}
        title={portalLabel}
        side="left"
        footer={
          <div>
            <Identity user={user} isDemo={isDemo} />
            <IdentityMeta roleLabel={roleLabel} isDemo={isDemo} />
            <div className="mt-3">
              <PortalActions onSignedOut={closeNav} />
            </div>
          </div>
        }
      >
        <nav id="portal-navigation" aria-label={`${portalLabel} navigation`}>
          <NavLinks items={navItems} pathname={pathname} onNavigate={closeNav} />
        </nav>
      </Sheet>
    </div>
  );
}
