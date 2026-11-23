"use client";

import { ChevronDown, Search } from "lucide-react";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { initials } from "@/lib/format";
import { cn } from "@/lib/cn";
import {
  normaliseRole,
  portalLinks,
  roleLabels,
} from "@/lib/auth/portal-links";
import { maskEmail } from "@/lib/demo/mask";

export type AccountUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  isDemo?: boolean | null;
};

export function AccountMenu({ user }: { user: AccountUser }) {
  const role = normaliseRole(user.role);
  const name = user.name?.trim() || "Your account";
  const isDemo = user.isDemo === true;
  const rawEmail = user.email ?? "";
  const email = isDemo ? (maskEmail(rawEmail) ?? rawEmail) : rawEmail;
  const firstName = name.split(/\s+/)[0];

  const items: MenuItem[] = [
    ...portalLinks[role],
    {
      label: "Browse properties",
      href: "/properties",
      icon: Search,
    },
  ];

  return (
    <Menu
      label="Account menu"
      // The trigger shows the initials and the first name, and WCAG 2.5.3 wants
      // the accessible name to contain that visible text.
      triggerLabel={`${initials(name)} ${firstName} — account menu`}
      align="end"
      triggerClassName="h-11 gap-2 rounded-full border border-ink-900/10 bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-forest-700/30 hover:bg-ivory-50"
      trigger={({ open }) => (
        <>
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-xs font-bold text-forest-800",
              isDemo && "ring-2 ring-amber-400 ring-offset-2",
            )}
            aria-hidden="true"
          >
            {initials(name)}
          </span>{" "}
          <span className="hidden max-w-24 truncate text-sm font-semibold text-ink-900 sm:block">
            {firstName}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-500 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </>
      )}
      header={
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-700/10 text-xs font-bold text-forest-800",
                isDemo && "ring-2 ring-amber-400 ring-offset-2",
              )}
              aria-hidden="true"
            >
              {initials(name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900">{name}</p>
              {email ? (
                <p className="truncate text-xs text-muted-500">{email}</p>
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
      }
      items={items}
      footer={
        <SignOutButton
          variant="ghost"
          size="sm"
          className="w-full"
          redirectTo="/"
        />
      }
    />
  );
}
