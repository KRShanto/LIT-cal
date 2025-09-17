import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getDbUser } from "@/lib/auth";

export default async function Topbar() {
  const user = await getDbUser();
  const avatar = user?.imageUrl || "/logo.png";
  const displayName = user?.name || user?.username || "Account";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-end border-b border-white/10 bg-neutral-950/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 text-slate-200 hover:bg-white/5">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
        </button>
        <Link
          href="/dashboard/settings/profile"
          className="flex items-center gap-2 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
        >
          <Image
            src={avatar}
            alt={displayName}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-base">{displayName}</span>
        </Link>
      </div>
    </header>
  );
}
