import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-slate-300">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-md bg-primary px-5 py-3 text-sm font-semibold tracking-wide text-neutral-950 transition hover:opacity-95"
          >
            Go to home
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md border border-white/10 px-5 py-3 text-sm text-slate-200 hover:bg-white/5"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
