"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Compass, X } from "lucide-react";

const STORAGE_KEY = "alara.tour.dismissed";

const stops = [
  {
    title: "Browse the catalogue",
    body: "URL-synced filters, pagination and an empty state for every combination.",
    href: "/properties",
  },
  {
    title: "Open a listing",
    body: "Gallery, verified agent, JSON-LD, guest enquiry and saved properties.",
    href: "/properties/lekki-phase-1-4-bedroom-duplex",
  },
  {
    title: "Agent workspace",
    body: "Live KPIs, listing actions and the enquiry status machine.",
    href: "/demo#agent",
  },
  {
    title: "Admin control tower",
    body: "Moderation queue, agent verification and the audit log.",
    href: "/demo#admin",
  },
];

/**
 * Floating tour affordance on public pages. Dismissal is remembered, the panel
 * is a labelled dialog with Escape-to-close, and the entrance animation is
 * skipped when the visitor asked for reduced motion.
 */
const DISMISS_EVENT = "alara:tour-dismissed";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(DISMISS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DISMISS_EVENT, onChange);
  };
}

/** Dismissal lives in localStorage, read through an external store so the
 * server snapshot stays hidden and hydration never disagrees. */
function useDismissed() {
  return useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEY) === "1",
    () => true,
  );
}

export function TourPill() {
  const dismissed = useDismissed();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const dismiss = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 print:hidden motion-reduce:transition-none">
      {open ? (
        <div
          role="dialog"
          aria-label="Portfolio tour"
          className="mb-2 w-80 max-w-[calc(100vw-2rem)] rounded-card border border-ink-900/10 bg-white p-4 shadow-lift"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm font-bold text-ink-900">Portfolio tour</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tour"
              className="rounded p-1 text-muted-500 hover:bg-ivory-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ol className="mt-3 space-y-2">
            {stops.map((stop, index) => (
              <li key={stop.title} className="text-sm">
                <Link
                  href={stop.href}
                  className="block rounded-control px-2 py-1.5 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700"
                >
                  <span className="font-semibold text-ink-900">
                    {index + 1}. {stop.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-500">
                    {stop.body}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full rounded-control border border-ink-900/10 px-3 py-2 text-xs font-semibold text-muted-500 hover:bg-ivory-100"
          >
            Dismiss for this browser
          </button>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-forest-700 px-4 text-sm font-bold text-white shadow-lift transition-transform hover:bg-forest-800 motion-reduce:transition-none"
      >
        <Compass className="h-4 w-4" aria-hidden="true" />
        Portfolio tour
      </button>
    </div>
  );
}
