"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type MenuItem = {
  label: string;
  href?: string;
  onSelect?: () => void;
  icon?: LucideIcon;
  description?: string;
  tone?: "default" | "danger";
};

type MenuProps = {
  /** Accessible name for the trigger, e.g. "Account menu". */
  label: string;
  /**
   * Trigger name when it must also carry the visible text (WCAG 2.5.3), e.g.
   * "Account menu: Alara". Falls back to `label`.
   */
  triggerLabel?: string;
  trigger: (state: { open: boolean }) => ReactNode;
  items: MenuItem[];
  header?: ReactNode;
  footer?: ReactNode;
  align?: "start" | "end";
  triggerClassName?: string;
  panelClassName?: string;
};

const ITEM_SELECTOR = '[role="menuitem"]';

/**
 * Small ARIA menu: one tab stop, arrow-key roving focus, Escape returns focus
 * to the trigger. Kept deliberately narrow — navigation and actions only.
 */
export function Menu({
  label,
  triggerLabel,
  trigger,
  items,
  header,
  footer,
  align = "end",
  triggerClassName,
  panelClassName,
}: MenuProps) {
  // The path the menu was opened on, rather than a boolean: a route change
  // closes the panel by derivation, with no setState-in-effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  const open = openPath === pathname;

  const close = useCallback((returnFocus = false) => {
    setOpenPath(null);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpenPath(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }

      if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") {
        return;
      }

      const nodes = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? [],
      );
      if (nodes.length === 0) return;

      event.preventDefault();
      const activeIndex = nodes.indexOf(document.activeElement as HTMLElement);

      if (event.key === "Home") {
        nodes[0].focus();
        return;
      }
      if (event.key === "End") {
        nodes[nodes.length - 1].focus();
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        activeIndex === -1
          ? step === 1
            ? 0
            : nodes.length - 1
          : (activeIndex + step + nodes.length) % nodes.length;

      nodes[nextIndex].focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(ITEM_SELECTOR)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const itemClass = (tone: MenuItem["tone"]) =>
    cn(
      "flex w-full items-start gap-2.5 rounded-control px-2.5 py-2 text-left text-sm font-semibold outline-none transition-colors",
      "focus-visible:bg-emerald-50 focus-visible:text-forest-800 hover:bg-ivory-100",
      tone === "danger" ? "text-danger hover:bg-danger/5 focus-visible:bg-danger/5" : "text-ink-700",
    );

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={triggerLabel ?? label}
        onClick={() => setOpenPath(open ? null : pathname)}
        className={cn("flex items-center rounded-full outline-none", triggerClassName)}
      >
        {trigger({ open })}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="menu"
          aria-label={label}
          onKeyDown={(event) => {
            if (event.key === "Tab") close();
          }}
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-[60] w-64 max-w-[calc(100vw-2rem)] rounded-card border border-ink-900/10 bg-white p-1.5 shadow-lift",
            align === "end" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {header ? (
            <div className="mb-1 border-b border-ink-900/5 px-2.5 pb-2.5 pt-1.5">
              {header}
            </div>
          ) : null}

          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  {Icon ? (
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block truncate">{item.label}</span>
                    {item.description ? (
                      <span className="mt-0.5 block text-xs font-medium text-muted-500">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              return (
                <li key={item.label} role="none">
                  {item.href ? (
                    <Link
                      role="menuitem"
                      tabIndex={-1}
                      href={item.href}
                      onClick={() => close()}
                      className={itemClass(item.tone)}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      role="menuitem"
                      tabIndex={-1}
                      onClick={() => {
                        close();
                        item.onSelect?.();
                      }}
                      className={itemClass(item.tone)}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {footer ? (
            <div className="mt-1 border-t border-ink-900/5 px-1 pt-2">
              {footer}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
