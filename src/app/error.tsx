"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory-50 px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
          We could not load this page
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          The request failed before it finished. Try again, and if it keeps
          happening head back to the homepage.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 font-mono text-xs text-gray-500">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-11 items-center justify-center rounded-md bg-forest-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-forest-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
