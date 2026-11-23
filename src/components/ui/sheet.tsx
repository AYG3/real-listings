"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Modal drawer used on small screens.
 *
 * Closed state stays mounted so the slide can transition, but it is `inert`
 * and `aria-hidden` — otherwise the links inside remain in the tab order while
 * invisible. The portal keeps the panel above page-level stacking contexts.
 */
export function Sheet({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  className,
}: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  // Server snapshot is `false`, client snapshot `true`: the portal is only
  // created after hydration, without a setState-in-effect cascade.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null || node === document.activeElement);

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const frame = window.requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn("fixed inset-0 z-[70] lg:hidden", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        role="presentation"
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-ink-900/40 transition-opacity duration-200 motion-reduce:transition-none",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!open}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 flex w-[min(20rem,85vw)] flex-col bg-white shadow-lift outline-none transition-transform duration-200 ease-out motion-reduce:transition-none",
          side === "right" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          className,
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-900/10 px-4">
          <h2 id={titleId} className="text-sm font-bold text-ink-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-control text-muted-500 transition-colors hover:bg-ivory-100 hover:text-ink-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-ink-900/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
