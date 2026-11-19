"use client";

import { useEffect, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";
import { mergeGuestSaves, toggleSavedListing } from "../actions";

const STORAGE_KEY = "alara:saved-listings";

function readGuestSaves(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeGuestSaves(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)]));
}

export function SaveButton({
  listingId,
  initialSaved,
  isAuthenticated,
}: {
  listingId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [note, setNote] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Fold anonymous saves into the account once, on the first authenticated view.
  useEffect(() => {
    if (!isAuthenticated) return;

    const guestSaves = readGuestSaves();
    if (guestSaves.length === 0) return;

    startTransition(async () => {
      const result = await mergeGuestSaves(guestSaves);
      if (result.merged > 0 || guestSaves.length > 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      if (guestSaves.includes(listingId)) setSaved(true);
    });
  }, [isAuthenticated, listingId]);

  function toggle() {
    const next = !saved;
    setSaved(next);
    setNote(null);

    if (!isAuthenticated) {
      const current = readGuestSaves();
      writeGuestSaves(next ? [...current, listingId] : current.filter((id) => id !== listingId));
      if (next) setNote("Saved on this device. Sign in to keep it.");
      return;
    }

    startTransition(async () => {
      const result = await toggleSavedListing(listingId, next);
      if (result.requiresAuth) {
        setSaved(!next);
        setNote("Sign in to save listings across devices.");
        return;
      }
      if (result.demoReadOnly) {
        setSaved(!next);
        setNote("Read-only demo account — saves are disabled here.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-control border text-sm font-semibold transition-colors",
          saved
            ? "border-forest-700/30 bg-forest-700/5 text-forest-800"
            : "border-ink-900/15 bg-white text-ink-700 hover:bg-ivory-100",
        )}
      >
        <Heart
          className={cn("h-4 w-4", saved && "fill-current")}
          aria-hidden
        />
        {saved ? "Saved" : "Save property"}
      </button>
      {note ? (
        <p role="status" className="mt-2 text-xs text-muted-500">
          {note}
        </p>
      ) : null}
    </div>
  );
}
