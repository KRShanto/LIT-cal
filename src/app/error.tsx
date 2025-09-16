"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to a monitoring service
    // console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        {error?.message && (
          <p className="mt-3 text-sm text-slate-400">{error.message}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-neutral-950 transition hover:opacity-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-white/10 px-5 py-3 text-sm text-slate-200 hover:bg-white/5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
