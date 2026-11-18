import { formatPrice, type Numeric } from "@/lib/format";
import { cn } from "@/lib/cn";

export function Price({
  value,
  currency,
  compact = false,
  className,
}: {
  value: Numeric | null | undefined;
  currency?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums", className)}>
      {formatPrice(value, currency, { compact })}
    </span>
  );
}
