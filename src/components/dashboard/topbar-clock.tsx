"use client";

import { useEffect, useMemo, useState } from "react";

export default function TopbarClock({
  timezone,
}: {
  timezone?: string | null;
}) {
  const tz = timezone && timezone.length > 0 ? timezone : undefined;
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = useMemo(() => {
    try {
      const datePart = new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: "short",
        month: "short",
        day: "2-digit",
      }).format(now);
      const timePart = new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
      }).format(now);
      const tzLabel = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzShort = tzLabel.includes("/")
        ? tzLabel.split("/").pop()
        : tzLabel;
      return { datePart, timePart, tzLabel, tzShort } as const;
    } catch {
      // Fallback to local if timezone is invalid
      const datePart = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "2-digit",
      }).format(now);
      const timePart = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }).format(now);
      const tzLabel = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzShort = tzLabel.includes("/")
        ? tzLabel.split("/").pop()
        : tzLabel;
      return { datePart, timePart, tzLabel, tzShort } as const;
    }
  }, [now, tz]);

  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1.5 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-primary"
        >
          <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm-.75-14.5v5.19l4.25 2.46.75-1.3-3.5-2.02V7.5h-1.5Z" />
        </svg>
        <span className="text-base font-semibold text-slate-100">
          {formatted.timePart}
        </span>
        <span className="text-sm text-slate-400">{formatted.datePart}</span>
        <span
          title={formatted.tzLabel}
          className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
        >
          {formatted.tzShort}
        </span>
      </div>
    </div>
  );
}
