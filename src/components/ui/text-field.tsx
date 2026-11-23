import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const labelClass =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-muted-500";

const controlBase =
  "h-11 w-full rounded-control border bg-white text-sm font-medium text-ink-900 transition-colors placeholder:font-normal placeholder:text-muted-500/70 focus:border-forest-700 focus:outline-none";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id"
> & {
  id: string;
  label: string;
  hint?: string;
  wrapperClassName?: string;
};

/**
 * The text sibling of `SelectField`: same label, height and focus ring, so a
 * mixed row lines up without per-field tweaks.
 */
export function TextField({
  id,
  label,
  hint,
  wrapperClassName,
  ...props
}: TextFieldProps) {
  return (
    <div className={cn("min-w-0", wrapperClassName)}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(controlBase, "border-ink-900/15 px-3 hover:border-ink-900/25")}
        {...props}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
