import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-white hover:bg-forest-800",
  secondary:
    "border border-forest-700/25 bg-white text-forest-700 hover:bg-forest-700/5",
  ghost: "text-ink-700 hover:bg-ivory-100",
  danger: "border border-danger/30 bg-white text-danger hover:bg-danger/5",
  gold: "bg-gold-500 text-forest-900 hover:bg-gold-600 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-[52px] px-6 text-base",
};

export function buttonStyles(
  options: { variant?: Variant; size?: Size; className?: string } = {},
): string {
  const { variant = "primary", size = "md", className } = options;
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant,
  size,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
