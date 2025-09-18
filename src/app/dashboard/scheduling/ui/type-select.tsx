"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "RADIO"
  | "CHECKBOX"
  | "DROPDOWN"
  | "PHONE";

export default function TypeSelect({
  value,
  onChange,
}: {
  value: QuestionType;
  onChange: (t: QuestionType) => void;
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

  const options: QuestionType[] = [
    "SHORT_TEXT",
    "LONG_TEXT",
    "RADIO",
    "CHECKBOX",
    "DROPDOWN",
    "PHONE",
  ];

  const toLabel = (t: QuestionType) =>
    t
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-white/15 bg-neutral-900/60 px-2 text-sm text-slate-100 outline-none transition hover:bg-white/5 focus-visible:ring-1 focus-visible:ring-white/20"
      >
        <span className="text-slate-100">{toLabel(value)}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 opacity-80 transition-transform pointer-events-none ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-950/95 backdrop-blur-sm shadow-xl">
          <ul className="max-h-60 overflow-y-auto py-1">
            {options.map((opt, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/5 ${
                    value === opt ? "bg-primary/10 text-white" : "text-slate-200"
                  }`}
                >
                  <span>{toLabel(opt)}</span>
                  {value === opt && (
                    <Check className="h-4 w-4 text-slate-300" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
