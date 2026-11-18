import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-ink-900/10 bg-white shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border-b border-ink-900/5 p-5", className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-caption font-semibold uppercase tracking-[0.16em] text-forest-700">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-h2 font-bold text-ink-900 md:text-h1">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm font-medium text-muted-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </header>
  );
}

export function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-md border border-forest-700/15 bg-forest-700/5 p-2 text-forest-700">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <p className="text-xs font-bold text-muted-500">{detail}</p>
      </div>
      <p className="mt-6 text-sm font-semibold text-muted-500">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-ink-900">{value}</p>
    </Card>
  );
}
