import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-end border-b border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 text-slate-200 hover:bg-white/5">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
        >
          <Image
            src="/logo.png"
            alt="Avatar"
            width={16}
            height={16}
            className="rounded"
          />
          Account
        </Link>
      </div>
    </header>
  );
}
