"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Clock, Globe, ChevronDown } from "lucide-react";
import { getTimezoneOptions } from "@/lib/timezones";

type Props = {
  value: string;
  onChange: (tz: string) => void;
  placeholder?: string;
};

/**
 * TimezonePicker
 *
 * Calendly-style timezone selector with:
 * - Search-as-you-type across IANA names
 * - Current time preview for selected and each option
 * - Cached list for instant open (see src/lib/timezones.ts)
 * - Matches input style (h-12, dark theme)
 *
 * Props:
 * - value: string (e.g., "Asia/Dhaka")
 * - onChange: (tz: string) => void
 * - placeholder?: string
 */
export default function TimezonePicker({
  value,
  onChange,
  placeholder = "Select timezone",
}: Props) {
  // Local open/close state for the popover
  const [open, setOpen] = useState(false);
  // Search query for client-side filtering
  const [query, setQuery] = useState("");
  // Refs to detect outside clicks and to focus the search input when opened
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Cache timezone options (label + value) so opening is instant
  const options = useMemo(() => getTimezoneOptions(), []);

  // Filter options using the query (case-insensitive)
  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q)
    );
  }, [options, query]);

  // Close the dropdown when clicking outside the component
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Focus the search input as soon as the dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  // Compute current time in the selected timezone for compact preview
  const nowInTz = useMemo(() => {
    try {
      if (!value) return "";
      return new Intl.DateTimeFormat([], {
        timeZone: value,
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());
    } catch {
      return "";
    }
  }, [value]);

  // Resolve the pretty label for the currently selected timezone
  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value]
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button mirrors input styling and shows current time on the right */}
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex h-12 w-full items-center justify-between rounded-md border border-white/10 bg-neutral-950 px-3 text-lg text-slate-100 outline-none transition hover:bg-white/5 focus:ring-2 focus:ring-primary"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-slate-400" />
          <span className={value ? "text-slate-100" : "text-slate-500"}>
            {value ? selectedLabel : placeholder}
          </span>
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          {value && (
            <>
              <Clock className="h-4 w-4" />
              <span className="text-base">{nowInTz}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {/* Dropdown with search box and fast, virtualized-feel list (simple map for now) */}
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-white/10 bg-neutral-950 shadow-lg">
          {/* Search header */}
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search timezones"
              className="w-full bg-transparent py-2 text-base text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>
          {/* Options list */}
          <ul className="max-h-72 overflow-y-auto py-1">
            {filtered.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-base hover:bg-white/5 ${
                    value === o.value
                      ? "bg-primary/10 text-white"
                      : "text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" />
                    {o.label}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Intl.DateTimeFormat([], {
                      timeZone: o.value,
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date())}
                  </span>
                </button>
              </li>
            ))}
            {/* Empty state */}
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-base text-slate-400">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
