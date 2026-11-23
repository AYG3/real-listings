"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu as MenuIcon, Search } from "lucide-react";
import { authClient } from "@/lib/auth/authClient";
import { brand } from "@/lib/brand";
import { buttonStyles } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { AccountMenu, type AccountUser } from "@/components/auth/account-menu";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { initials } from "@/lib/format";
import {
  normaliseRole,
  portalLinks,
  roleLabels,
} from "@/lib/auth/portal-links";
import { maskEmail } from "@/lib/demo/mask";
import { cn } from "@/lib/cn";

const links = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Land", href: "/land" },
  { label: "Agents", href: "/agents" },
  { label: "All properties", href: "/properties" },
];

/**
 * The session is read on the client on purpose: reading cookies in the
 * marketing layout would opt `/properties` and `/case-study` into dynamic
 * rendering and undo the cached public reads. The placeholder below holds the
 * cluster's width so the swap does not shift the layout.
 */
function AccountPlaceholder() {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 items-center gap-2 rounded-full border border-ink-900/10 bg-white pl-1 pr-3"
    >
      <span className="h-8 w-8 animate-pulse rounded-full bg-ivory-100 motion-reduce:animate-none" />
      <span className="hidden h-3 w-14 animate-pulse rounded bg-ivory-100 sm:block motion-reduce:animate-none" />
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as AccountUser | undefined;
  const role = normaliseRole(user?.role);
  const isDemo = user?.isDemo === true;
  const name = user?.name?.trim() || "Your account";
  const workspace = portalLinks[role];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-30 w-full border-b border-ink-900/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="shrink-0 text-lg font-extrabold uppercase tracking-[0.12em] text-forest-900 md:text-xl"
          >
            {brand.name}
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold text-muted-500 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-forest-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/properties"
              aria-label="Search properties"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-500 transition-colors hover:bg-ivory-100 hover:text-forest-700 sm:flex"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>

            <div className="hidden items-center gap-2 lg:flex">
              {isPending ? (
                <AccountPlaceholder />
              ) : user ? (
                <AccountMenu user={user} />
              ) : (
                <>
                  <Link
                    href="/login"
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                      className: "whitespace-nowrap",
                    })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/agent/auth/register"
                    className={buttonStyles({ size: "sm" })}
                  >
                    List property
                  </Link>
                </>
              )}
            </div>

            {/* Below lg the sheet is the single navigation and account surface:
                an avatar plus a hamburger does not fit beside the wordmark. */}
            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label="Open navigation"
                className="flex h-11 w-11 items-center justify-center rounded-control border border-ink-900/10 bg-white text-ink-700 transition-colors hover:bg-ivory-100"
              >
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Sheet
        open={mobileOpen}
        onClose={closeMobile}
        title="Menu"
        side="right"
        footer={
          <div className="space-y-2">
            <Link
              href="/agent/auth/register"
              onClick={closeMobile}
              className={buttonStyles({ size: "md", className: "w-full" })}
            >
              List property
            </Link>
            {user ? (
              <SignOutButton
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onSignedOut={closeMobile}
              />
            ) : !isPending ? (
              <Link
                href="/login"
                onClick={closeMobile}
                className={buttonStyles({
                  variant: "secondary",
                  size: "md",
                  className: "w-full",
                })}
              >
                Sign in
              </Link>
            ) : null}
          </div>
        }
      >
        {user ? (
          <>
            <div className="mb-4 rounded-card border border-ink-900/10 bg-ivory-50 p-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-sm font-bold text-forest-800",
                    isDemo && "ring-2 ring-amber-400 ring-offset-2",
                  )}
                  aria-hidden="true"
                >
                  {initials(name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900">
                    {name}
                  </p>
                  {user.email ? (
                    <p className="truncate text-xs text-muted-500">
                      {isDemo
                        ? (maskEmail(user.email) ?? user.email)
                        : user.email}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-forest-700/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-forest-800">
                  {roleLabels[role]}
                </span>
                {isDemo ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                    Demo
                  </span>
                ) : null}
              </div>
            </div>

            {workspace.length > 0 ? (
              <div className="mb-4">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-500">
                  Your workspace
                </p>
                <ul className="flex flex-col gap-1">
                  {workspace.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={closeMobile}
                        className="flex min-h-11 items-center gap-3 rounded-control px-3 text-sm font-semibold text-forest-800 transition-colors hover:bg-emerald-50"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}

        <nav id="mobile-navigation" aria-label="Primary">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobile}
                  className="flex min-h-11 items-center rounded-control px-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-ivory-100 hover:text-forest-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Sheet>
    </>
  );
}
