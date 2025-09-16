import Image from "next/image";
import Link from "next/link";

/**
 * PublicFooter
 * Reusable footer for marketing/auth pages.
 *
 * - Dark-only aesthetic
 * - Links jump to landing page sections
 */
export default function PublicFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="LIT Cal"
            width={22}
            height={22}
            className="rounded"
          />
          <span className="text-base text-slate-400">© {year} LIT Cal</span>
        </div>
        <div className="flex items-center gap-4 text-base text-slate-400">
          <Link href="/#features" className="hover:opacity-80">
            Features
          </Link>
          <Link href="/#how" className="hover:opacity-80">
            How it works
          </Link>
          <Link href="/#cta" className="hover:opacity-80">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
