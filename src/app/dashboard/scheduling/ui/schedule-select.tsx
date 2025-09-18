"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";

export type ScheduleOption = { id: string; name: string; isDefault: boolean };

export default function ScheduleSelect({
  value,
  options,
  onChange,
}: {
  value: string | null | undefined;
  options: ScheduleOption[];
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.id === value) ?? null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex h-11 w-full items-center justify-between rounded-md border border-white/15 bg-neutral-900/60 px-3 text-base text-slate-100 outline-none transition hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-white/20"
      >
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-slate-100">
            {selected ? `${selected.name}${selected.isDefault ? " (default)" : ""}` : "Select schedule"}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-950/95 backdrop-blur-sm shadow-xl">
          <ul className="max-h-72 overflow-y-auto py-1">
            {options.map((o, idx) => {
              const isSelected = value === o.id;
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-base hover:bg-white/5 ${
                      isSelected ? "bg-primary/10 text-white" : "text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        {o.name}
                        {o.isDefault && (
                          <span className="ml-2 inline-flex items-center rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                            default
                          </span>
                        )}
                      </span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-slate-300" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
