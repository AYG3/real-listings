import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";

/**
 * Single auth surface for every entry point (buyer, admin, agent).
 * Phase 1 replaced three near-identical layouts with this one.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-forest-900 px-4 py-10">
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/images/auth-bg.svg')] bg-cover bg-center"
      />
      <div aria-hidden className="absolute inset-0 bg-forest-900/70" />

      <section className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-3 text-white"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={40}
            height={40}
            className="rounded-control"
            priority
          />
          <span className="text-lg font-bold uppercase tracking-[0.18em]">
            {brand.name}
          </span>
        </Link>

        <div className="rounded-card border border-white/15 bg-ivory-50 p-6 shadow-lift sm:p-8">
          {title ? (
            <>
              <h1 className="text-h2 font-bold text-ink-900">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-muted-500">{subtitle}</p>
              ) : null}
              <div className="mt-6">{children}</div>
            </>
          ) : (
            children
          )}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-white/75">{footer}</div>
        ) : null}
      </section>
    </main>
  );
}
