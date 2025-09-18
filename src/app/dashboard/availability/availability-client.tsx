"use client";

import React, { useMemo, useState } from "react";
import TimezonePicker from "@/components/timezone-picker";
import { X, Plus, CalendarPlus, Clock } from "lucide-react";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type Slot = {
  weekday: Weekday;
  startMinutes: number; // minutes from 00:00
  endMinutes: number; // minutes from 00:00
};

/**
 * AvailabilityClient
 *
 * Client-only UI for creating a Schedule and weekly AvailabilitySlots.
 * No backend calls yet — submission logs the payload and closes the modal.
 *
 * Features:
 * - Open modal from a primary button
 * - Inputs: schedule name, timezone, isDefault
 * - Add/remove time slots per weekday
 * - Lightweight modal overlay without external dependencies
 */
export default function AvailabilityClient() {
  const [open, setOpen] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [weekday, setWeekday] = useState<Weekday>("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slots, setSlots] = useState<Slot[]>([]);

  const weekdays: Weekday[] = useMemo(
    () => [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ],
    []
  );

  const weekdayLabel: Record<Weekday, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
  };

  function timeToMinutes(t: string): number {
    const [h, m] = t.split(":").map((x) => parseInt(x, 10));
    return h * 60 + m;
  }

  function minutesToTime(min: number): string {
    const h = Math.floor(min / 60)
      .toString()
      .padStart(2, "0");
    const m = (min % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

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

  function addSlot() {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    if (Number.isNaN(start) || Number.isNaN(end) || start >= end) {
      alert("Please choose a valid start and end time.");
      return;
    }
    setSlots((prev) => [
      ...prev,
      { weekday, startMinutes: start, endMinutes: end },
    ]);
    // Reset time range for quick next add
    setStartTime("09:00");
    setEndTime("17:00");
  }

  // Note: per-slot removal UI is not present in the current design.
  // If needed later, implement removeSlot and expose remove controls.

  function resetForm() {
    setScheduleName("");
    setTimezone("");
    setIsDefault(false);
    setWeekday("MONDAY");
    setStartTime("09:00");
    setEndTime("17:00");
    setSlots([]);
  }

  function submit() {
    if (!scheduleName.trim()) {
      alert("Please enter a schedule name.");
      return;
    }
    if (!timezone) {
      alert("Please select a timezone.");
      return;
    }
    if (slots.length === 0) {
      alert("Please add at least one availability slot.");
      return;
    }

    const payload = {
      schedule: {
        name: scheduleName.trim(),
        isDefault,
        timezone,
      },
      slots,
    };

    // No backend yet — just preview in console and close
    console.log("Create Availability Payload", payload);
    setOpen(false);
    resetForm();
  }

  const grouped = useMemo(() => {
    const map: Record<Weekday, Slot[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    for (const s of slots) map[s.weekday].push(s);
    // sort by start time for readability
    (Object.keys(map) as Weekday[]).forEach((d) =>
      map[d].sort((a, b) => a.startMinutes - b.startMinutes)
    );
    return map;
  }, [slots]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Availability</h1>
          <p className="mt-1 text-slate-400">
            Create weekly hours your invitees can book.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <CalendarPlus className="h-4 w-4" /> Create availability
        </button>
      </div>

      {/* Simple empty state for now */}
      <div className="rounded-md border border-white/10 p-6 text-slate-400">
        No schedules yet. Click &quot;Create availability&quot; to add one.
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-950 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-medium text-white">
                New availability
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="grid flex-1 min-h-0 gap-6 overflow-hidden px-6 py-6 md:grid-cols-2">
              {/* Left column: schedule meta */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">
                    Schedule name
                  </label>
                  <input
                    value={scheduleName}
                    onChange={(e) => setScheduleName(e.target.value)}
                    placeholder="e.g., Working hours"
                    className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Timezone</label>
                  <TimezonePicker value={timezone} onChange={setTimezone} />
                </div>

                <label className="mt-2 inline-flex items-center gap-3 text-slate-200">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                  />
                  Make this my default schedule
                </label>

                {/* Weekly hours builder (moved under schedule meta) */}
                <div className="mt-4 rounded-md border border-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <h3 className="flex items-center gap-2 text-base font-medium text-white">
                      <Clock className="h-4 w-4" /> Weekly hours
                    </h3>
                    <p className="text-xs text-slate-400">
                      Choose a day and time range, then press +
                    </p>
                  </div>

                  <div className="grid items-end gap-3 p-4 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <label className="mb-1 block text-sm text-slate-300">
                        Day
                      </label>
                      <select
                        value={weekday}
                        onChange={(e) => setWeekday(e.target.value as Weekday)}
                        className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary"
                      >
                        {weekdays.map((d, idx) => (
                          <option key={idx} value={d}>
                            {weekdayLabel[d]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className="mb-1 block text-sm text-slate-300">
                        Start
                      </label>
                      <input
                        type="time"
                        step="60"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary [&::-webkit-datetime-edit]:text-slate-100 [&::-webkit-calendar-picker-indicator]:opacity-70"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="mb-1 block text-sm text-slate-300">
                        End
                      </label>
                      <input
                        type="time"
                        step="60"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary [&::-webkit-datetime-edit]:text-slate-100 [&::-webkit-calendar-picker-indicator]:opacity-70"
                      />
                    </div>

                    <div className="md:col-span-1 flex items-center justify-start md:justify-end">
                      <button
                        type="button"
                        onClick={addSlot}
                        aria-label="Add availability slot"
                        disabled={(() => {
                          const start = timeToMinutes(startTime);
                          const end = timeToMinutes(endTime);
                          return (
                            Number.isNaN(start) ||
                            Number.isNaN(end) ||
                            start >= end
                          );
                        })()}
                        className="inline-flex aspect-square h-10 w-10 items-center justify-center rounded-md bg-primary p-0 text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                        title="Add slot"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline validation hint for invalid time range */}
                  {(() => {
                    const start = timeToMinutes(startTime);
                    const end = timeToMinutes(endTime);
                    if (
                      Number.isNaN(start) ||
                      Number.isNaN(end) ||
                      start >= end
                    ) {
                      return (
                        <div className="px-4 pb-3 text-sm text-red-300">
                          Please select a valid time range where Start is before
                          End.
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Summary list removed from left. See right column summary. */}
                </div>
              </div>
              {/* Right column: weekly summary */}
              <div className="flex min-h-0 flex-col">
                <div className="flex min-h-0 flex-1 flex-col rounded-md border border-white/10">
                  <div className="border-b border-white/10 p-4">
                    <h3 className="text-base font-medium text-white">
                      Weekly summary
                    </h3>
                  </div>
                  <ul className="flex-1 overflow-y-auto p-4 space-y-3">
                    {weekdays.map((d, idx) => (
                      <li key={idx} className="rounded border border-white/10">
                        <div className="border-b border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                          {weekdayLabel[d]}
                        </div>
                        <div className="px-3 py-2 text-sm text-slate-200">
                          {grouped[d].length === 0 ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {grouped[d].map((s, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="rounded border border-white/15 bg-white/5 px-2 py-1"
                                >
                                  {formatMinutesLocal12h(s.startMinutes)} –{" "}
                                  {formatMinutesLocal12h(s.endMinutes)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="rounded-md border border-white/15 px-4 py-2 text-base text-white hover:bg-white/5 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                className="rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
