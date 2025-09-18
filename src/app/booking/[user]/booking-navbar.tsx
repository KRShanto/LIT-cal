import Image from "next/image";
import Link from "next/link";

/**
 * BookingNavbar
 * Simple navigation bar for the booking page with LIT Cal branding and CTA.
 */
export default function BookingNavbar() {
  return (
    <div className="relative z-10 border-b border-white/10 bg-neutral-950/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
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
          <span className="text-xl font-semibold tracking-tight text-white">
            LIT Cal
          </span>
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md bg-primary px-4 py-2 font-semibold text-base text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          Try free
        </Link>
      </nav>
    </div>
  );
}
