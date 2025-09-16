import Image from "next/image";
import Link from "next/link";

/**
 * PublicNavbar
 * Reusable top navigation for public pages (landing, auth, marketing).
 *
 * - Dark-only aesthetic, uses Tailwind v4 tokens
 * - Links target sections on the landing page using hash routes
 * - CTA routes to registration
 */
export default function PublicNavbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <Link
        href="/"
        className="flex items-center gap-3"
        aria-label="LIT Cal Home"
      >
        <Image
          src="/logo.png"
          alt="LIT Cal"
          width={28}
          height={28}
          className="rounded"
        />
        <span className="text-xl md:text-2xl font-semibold tracking-tight">
          LIT Cal
        </span>
      </Link>
      <div className="hidden items-center gap-6 sm:flex">
        <Link
          href="/#features"
          className="text-base text-slate-300 hover:text-slate-100"
        >
          Features
        </Link>
        <Link
          href="/#how"
          className="text-base text-slate-300 hover:text-slate-100"
        >
          How it works
        </Link>
        <Link
          href="/#cta"
          className="text-base text-slate-300 hover:text-slate-100"
        >
          Get started
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md bg-primary px-4 py-2 font-semibold text-base text-neutral-950 shadow-sm transition hover:opacity-90"
        >
          Try free
        </Link>
      </div>
    </nav>
  );
}
