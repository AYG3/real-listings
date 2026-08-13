"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Upload,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { label: "Listings", href: "/admin/listings", icon: Building2 },
  { label: "Agents", href: "/admin/agents", icon: Users },
  { label: "Upload", href: "/admin/upload", icon: Upload },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5 text-gray-700" aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#114b3d] text-sm font-bold text-white">
              A
            </div>
            <span className="text-sm font-bold text-gray-950">Admin Panel</span>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-[#114b3d]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#114b3d]">
              AD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-950">
                Admin
              </p>
              <p className="truncate text-xs text-gray-500">
                admin@example.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}