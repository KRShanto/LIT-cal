"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type Schedule = {
  id: string;
  name: string;
  isDefault: boolean;
  timezone: string | null;
  slots: {
    id: string;
    weekday: Weekday;
    startMinutes: number;
    endMinutes: number;
  }[];
};

type Props = {
  schedules: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
};

function formatMinutesLocal12h(totalMinutes: number): string {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setMinutes(totalMinutes);
  return new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(base);
}

const weekdays: Weekday[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const weekdayLabel: Record<Weekday, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function SchedulesList({ schedules, onEdit, onDelete }: Props) {
  if (!schedules.length)
    return (
      <div className="p-6 text-slate-400">
        No schedules yet. Click &quot;Create availability&quot; to add one.
      </div>
    );

  return (
    <ul className="grid gap-4 p-4 sm:grid-cols-1 lg:grid-cols-2">
      {schedules.map((sch, idx) => (
        <li
          key={idx}
          className="rounded-lg border border-white/10 bg-neutral-900/40 p-4 shadow-sm transition hover:border-white/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-lg font-semibold text-white">
                  {sch.name}
                </span>
                {sch.isDefault && (
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    Default
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Timezone: {sch.timezone || "—"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(sch)}
                className="rounded-md border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-400"
                title="Edit schedule"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(sch)}
                className="rounded-md border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-red-500/70 hover:bg-red-500/10 hover:text-red-400"
                title="Delete schedule"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 divide-y divide-white/10 rounded-md border border-white/10">
            {weekdays.map((d, dIdx) => {
              const daySlots = sch.slots
                .filter((s) => s.weekday === d)
                .sort((a, b) => a.startMinutes - b.startMinutes);
              return (
                <div key={dIdx} className="flex items-center gap-3 p-2">
                  <span className="w-28 shrink-0 text-sm font-medium text-slate-200">
                    {weekdayLabel[d]}
                  </span>
                  <div className="min-w-0 flex-1">
                    {daySlots.length === 0 ? (
                      <span className="text-sm text-slate-500">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {daySlots.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-100"
                          >
                            {formatMinutesLocal12h(s.startMinutes)} –{" "}
                            {formatMinutesLocal12h(s.endMinutes)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
