import { cn } from "@/lib/cn";
import {
  listingStatusLabel,
  listingStatusTone,
  type StatusTone,
} from "@/lib/status";

const toneStyles: Record<StatusTone, string> = {
  neutral: "border-ink-900/10 bg-ivory-100 text-ink-700",
  success: "border-success/25 bg-success/10 text-forest-700",
  warning: "border-warning/25 bg-warning/10 text-warning",
  info: "border-forest-700/20 bg-forest-700/5 text-forest-700",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: StatusTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <Badge tone={listingStatusTone(status)} className={className}>
      {listingStatusLabel(status)}
    </Badge>
  );
}
