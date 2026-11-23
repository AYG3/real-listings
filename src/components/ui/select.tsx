"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const PANEL_MAX_HEIGHT = 288;
const PANEL_MIN_WIDTH = 176;

const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-500";

const controlBase =
  "h-11 w-full rounded-control border bg-white text-sm font-medium text-ink-900 transition-colors placeholder:font-normal placeholder:text-muted-500/70 focus:border-forest-700 focus:outline-none";

type Option = { value: string; label: string; disabled: boolean };

function parseOptions(children: ReactNode): Option[] {
  return Children.toArray(children).flatMap((child) => {
    if (
      !isValidElement<{
        value?: string | number;
        disabled?: boolean;
        children?: ReactNode;
      }>(child)
    ) {
      return [];
    }

    const { value, disabled, children: label } = child.props;

    return [
      {
        value: String(value ?? ""),
        label:
          typeof label === "string" || typeof label === "number"
            ? String(label)
            : String(label ?? ""),
        disabled: Boolean(disabled),
      },
    ];
  });
}

type SelectFieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  /** Highlights the control when the filter already has a value. */
  active?: boolean;
  wrapperClassName?: string;
  children: ReactNode;
};

/**
 * A select with two lives.
 *
 * Before hydration — and with JavaScript off — this is the native `<select>`,
 * styled to match. It owns the `name`, so the plain GET form submits exactly as
 * before. After hydration the native control is hidden (it stays the form
 * field) and a custom listbox takes its place visually: consistent across
 * platforms, with room for a check mark and comfortable rows, none of which the
 * OS popup allows.
 *
 * Accessibility follows the APG "select-only combobox" pattern: one tab stop,
 * `aria-activedescendant` to track the highlighted row, arrows/Home/End,
 * first-letter type-ahead, Enter to commit, Escape to dismiss. Focus never
 * leaves the trigger, so there is no focus trap to maintain.
 */
export function SelectField({
  id,
  label,
  name,
  defaultValue,
  hint,
  active = false,
  wrapperClassName,
  children,
}: SelectFieldProps) {
  const options = useMemo(() => parseOptions(children), [children]);
  const initialValue = defaultValue ?? options[0]?.value ?? "";

  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === initialValue),
    ),
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  // Portalling to <body> takes the listbox out of every landmark, which is an
  // axe `region` failure. Anchoring to the surrounding <main> keeps it inside
  // the page's landmark structure. Safe because the panel is position: fixed,
  // so no ancestor's overflow can clip it.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const typeaheadRef = useRef({
    query: "",
    timer: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const labelId = `${id}-label`;
  const hintId = hint ? `${id}-hint` : undefined;
  const selected = options.find((option) => option.value === value) ?? options[0];

  // Flip the enhancement flag on the DOM rather than in state: no hydration
  // mismatch, and CSS decides which of the two controls is visible.
  useEffect(() => {
    wrapperRef.current?.setAttribute("data-enhanced", "true");
  }, []);

  useEffect(
    () => () => {
      if (typeaheadRef.current.timer) clearTimeout(typeaheadRef.current.timer);
    },
    [],
  );

  const enabledIndexes = useMemo(
    () =>
      options
        .map((option, index) => (option.disabled ? -1 : index))
        .filter((index) => index >= 0),
    [options],
  );

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => {
      const position = enabledIndexes.indexOf(current);
      if (position === -1) return enabledIndexes[0] ?? current;
      const next =
        (position + direction + enabledIndexes.length) % enabledIndexes.length;
      return enabledIndexes[next];
    });
  };

  const openPanel = () => {
    setPortalTarget(
      wrapperRef.current?.closest<HTMLElement>("main, [role='main']") ??
        document.body,
    );
    setActiveIndex(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;

    setValue(option.value);
    // The native select stays the form field; keep it in sync so the GET
    // request carries the chosen value.
    if (selectRef.current) selectRef.current.value = option.value;
    setOpen(false);
    triggerRef.current?.focus();
  };

  const typeahead = (char: string) => {
    const state = typeaheadRef.current;
    if (state.timer) clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = setTimeout(() => {
      state.query = "";
    }, 600);

    const query = state.query;
    const start = open ? activeIndex + 1 : 0;

    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (start + offset) % options.length;
      const option = options[index];
      if (option.disabled || !option.label.toLowerCase().startsWith(query)) {
        continue;
      }
      if (open) setActiveIndex(index);
      else commit(index);
      return;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) move(1);
        else openPanel();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) move(-1);
        else openPanel();
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(enabledIndexes[0] ?? 0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? 0);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openPanel();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        if (open) setOpen(false);
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.altKey
        ) {
          typeahead(event.key);
        }
    }
  };

  // Position the portalled panel against the trigger, flipping above when the
  // viewport runs out of room below. Imperative styles keep this out of render.
  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const rect = trigger.getBoundingClientRect();
      const width = Math.max(rect.width, PANEL_MIN_WIDTH);
      const height = Math.min(PANEL_MAX_HEIGHT, panel.scrollHeight);
      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const openAbove =
        spaceBelow < Math.min(height, 200) && rect.top > spaceBelow;
      const left = Math.max(
        8,
        Math.min(rect.left, window.innerWidth - width - 8),
      );

      panel.style.width = `${width}px`;
      panel.style.left = `${left}px`;
      panel.style.top = openAbove ? "" : `${rect.bottom + 6}px`;
      panel.style.bottom = openAbove
        ? `${window.innerHeight - rect.top + 6}px`
        : "";
    };

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);

    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document
      .getElementById(`${baseId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, baseId]);

  return (
    <div
      ref={wrapperRef}
      className={cn("select-field min-w-0", wrapperClassName)}
      data-enhanced="false"
    >
      <span id={labelId} className={labelClass}>
        {label}
      </span>

      <div className="relative">
        <div className="select-field__native">
          <select
            ref={selectRef}
            id={id}
            name={name}
            defaultValue={initialValue}
            aria-describedby={hintId}
            className={cn(
              controlBase,
              "appearance-none pl-3 pr-10",
              active
                ? "border-forest-700/50 bg-emerald-50/60"
                : "border-ink-900/15 hover:border-ink-900/25",
            )}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-500"
            aria-hidden="true"
          />
        </div>

        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-labelledby={labelId}
          aria-activedescendant={
            open ? `${baseId}-option-${activeIndex}` : undefined
          }
          aria-describedby={hintId}
          data-active={active || undefined}
          onClick={() => (open ? setOpen(false) : openPanel())}
          onKeyDown={onKeyDown}
          className={cn(
            "select-field__trigger h-11 w-full items-center justify-between gap-2 rounded-control border bg-white pl-3 pr-3 text-left text-sm font-medium text-ink-900 transition-colors focus-visible:border-forest-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/20",
            active
              ? "border-forest-700/50 bg-emerald-50/60"
              : "border-ink-900/15 hover:border-ink-900/25",
            open && "border-forest-700 ring-2 ring-forest-700/15",
          )}
        >
          <span className="truncate">{selected?.label ?? ""}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-500 transition-transform motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-500">
          {hint}
        </p>
      ) : null}

      {mounted && open && portalTarget
        ? createPortal(
            <div
              ref={panelRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={labelId}
              className="fixed z-[80] overflow-y-auto overscroll-contain rounded-card border border-ink-900/10 bg-white p-1 shadow-lift"
              style={{ maxHeight: PANEL_MAX_HEIGHT }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isActive = index === activeIndex;

                return (
                  <div
                    key={`${option.value}-${index}`}
                    id={`${baseId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    // Keep focus on the trigger so the panel is not a focus
                    // trap and arrows/Escape keep working after a click.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={cn(
                      "flex min-h-11 cursor-pointer select-none items-center justify-between gap-2 rounded-control px-3 text-sm",
                      option.disabled && "cursor-not-allowed opacity-40",
                      isActive
                        ? "bg-forest-700/10 text-forest-900"
                        : "text-ink-700",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? (
                      <Check
                        className="h-4 w-4 shrink-0 text-forest-700"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>,
            portalTarget,
          )
        : null}    </div>
  );
}
