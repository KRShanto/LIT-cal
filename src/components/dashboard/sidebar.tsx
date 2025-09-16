"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  CalendarRange,
  Users,
  Settings,
  Plus,
  Copy,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/scheduling", label: "Scheduling", Icon: CalendarClock },
  { href: "/meetings", label: "Meetings", Icon: CalendarClock },
  { href: "/availability", label: "Availability", Icon: CalendarRange },
  { href: "/contacts", label: "Contacts", Icon: Users },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText("https://lit.cal/you");
    } catch (e) {
      // no-op
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-neutral-950 px-5 py-6 text-slate-200 md:block md:w-72 md:text-base">
      <div className="flex h-full flex-col">
        <Link
          href="/"
          className="flex items-center gap-3 px-2"
          aria-label="LIT Cal Home"
        >
          <Image
            src="/logo.png"
            alt="LIT Cal"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="text-2xl font-semibold tracking-tight">LIT Cal</span>
        </Link>

        <Link
          href="/scheduling?new=true"
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/60 bg-transparent px-5 py-3 text-base font-semibold text-primary transition hover:bg-primary/10"
        >
          <Plus className="h-5 w-5" /> Create
        </Link>

        <nav className="mt-10 space-y-1">
          {navItems.map((item, index) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={index}
                href={item.href}
                className={`group flex items-center justify-between rounded-md px-3 py-2.5 text-base hover:bg-white/5 ${
                  active ? "bg-primary/10 text-white" : "text-slate-200"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.Icon
                    className={`h-5 w-5 ${
                      active
                        ? "text-primary"
                        : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-md border border-white/10 p-4">
          <p className="text-base text-slate-300">Share your booking link</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 rounded bg-neutral-900 px-3 py-2 text-sm">
              https://lit.cal/you
            </div>
            <button
              onClick={copyUrl}
              className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
