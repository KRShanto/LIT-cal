export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 p-6">
      {/* Profile card skeleton */}
      <section className="rounded-lg border border-white/10 bg-neutral-950/50 p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-1 h-5 w-72 animate-pulse rounded bg-white/5" />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Avatar + buttons */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <div className="h-32 w-32 animate-pulse rounded-full bg-white/10" />
              <div className="flex gap-3">
                <div className="h-10 w-32 animate-pulse rounded-md bg-primary/20" />
                <div className="h-10 w-28 animate-pulse rounded-md bg-white/10" />
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-10 w-36 animate-pulse rounded-md bg-primary/30" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-white/10" />
        </div>
      </section>

      {/* Password card skeleton */}
      <section className="rounded-lg border border-white/10 bg-neutral-950/50 p-6">
        <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-1 h-5 w-80 animate-pulse rounded bg-white/5" />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2 h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
          <div className="h-12 w-full animate-pulse rounded-md border border-white/10 bg-white/5" />
        </div>

        <div className="mt-6 h-10 w-40 animate-pulse rounded-md bg-primary/30" />
      </section>
    </div>
  );
}
