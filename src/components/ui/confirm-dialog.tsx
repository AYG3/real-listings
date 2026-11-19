"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  /** The exact text the operator must type to arm the confirm button. */
  phrase: string;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Type-to-confirm dialog for destructive admin actions. Focus moves to the
 * input on open, Escape cancels, and the confirm button stays disabled until
 * the phrase matches exactly.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  phrase,
  confirmLabel,
  pending = false,
  onConfirm,
  onCancel,
}: Props) {
  const [typed, setTyped] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  // The caller unmounts this by flipping `open`; reset on close so a reopened
  // dialog never starts armed.
  if (!open) {
    if (typed) setTyped("");
    return null;
  }

  const armed = typed.trim() === phrase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-lg font-bold text-gray-950">
              {title}
            </h2>
            <p id="confirm-description" className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Type <span className="font-mono text-gray-950">{phrase}</span> to confirm
          <input
            ref={inputRef}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            autoComplete="off"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-rose-500"
          />
        </label>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!armed || pending}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-bold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
