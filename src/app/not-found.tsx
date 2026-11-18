import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-700">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
          This page does not exist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The link may be outdated, or the property may have been removed from
          the market.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-forest-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
          >
            Back to home
          </Link>
          <Link
            href="/buy"
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Browse properties
          </Link>
        </div>
      </div>
    </main>
  );
}
