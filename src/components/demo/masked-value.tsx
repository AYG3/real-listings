import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Renders an already-masked value with a cue that reads as policy, not as
 * broken data. The masking itself happens on the server — this component only
 * explains it.
 */
export function MaskedValue({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-baseline gap-1", className)}
      title="Hidden in demo mode"
    >
      <span className="break-all">{value}</span>
      <Lock
        className="h-3 w-3 shrink-0 translate-y-px text-amber-600"
        aria-hidden="true"
      />
      <span className="sr-only"> Hidden in demo mode.</span>
    </span>
  );
}
