"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Clock, Loader2 } from "lucide-react";
import TimezonePicker from "@/components/timezone-picker";
import { createSchedule } from "@/actions/schedules/create-schedule";
import { updateSchedule } from "@/actions/schedules/update-schedule";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type Slot = { weekday: Weekday; startMinutes: number; endMinutes: number };

type EditTarget = {
  id: string;
  name: string;
  timezone: string | null;
  isDefault: boolean;
  slots: Slot[];
} | null;

type Props = {
  isOpen: boolean;
  visible: boolean;
  defaultTimezone: string;
  onClose: () => void;
  editing: EditTarget;
};

export default function CreateEditModal({
  isOpen,
  visible,
  defaultTimezone,
  onClose,
  editing,
}: Props) {
  const [scheduleName, setScheduleName] = useState("");
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [isDefault, setIsDefault] = useState(false);
  const [weekday, setWeekday] = useState<Weekday>("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editing) {
      setScheduleName(editing.name);
      setTimezone(editing.timezone || defaultTimezone);
      setIsDefault(editing.isDefault);
      setSlots(editing.slots || []);
    } else {
      setScheduleName("");
      setTimezone(defaultTimezone);
      setIsDefault(false);
      setSlots([]);
    }
  }, [isOpen, editing, defaultTimezone]);

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
    setStartTime("09:00");
    setEndTime("17:00");
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-950 shadow-xl transition-transform duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-medium text-white">
            {editing ? "Edit availability" : "New availability"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 min-h-0 gap-6 overflow-hidden px-6 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Schedule name</label>
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
                    className="inline-flex aspect-square h-10 w-10 items-center justify-center rounded-md bg-primary p-0 text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                      {slots.filter((s) => s.weekday === d).length === 0 ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {slots
                            .filter((s) => s.weekday === d)
                            .sort((a, b) => a.startMinutes - b.startMinutes)
                            .map((s, sIdx) => (
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

        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/15 px-4 py-2 text-base text-white hover:bg-white/5 focus:outline-none"
          >
            Cancel
          </button>
          {editing ? (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const res = await updateSchedule({
                  id: editing!.id,
                  name: scheduleName.trim(),
                  timezone,
                  isDefault,
                  slots,
                });
                setBusy(false);
                if (!res.ok) return alert(res.error);

                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                if (!scheduleName.trim())
                  return alert("Please enter a schedule name.");
                if (!timezone) return alert("Please select a timezone.");
                if (slots.length === 0)
                  return alert("Please add at least one availability slot.");
                setBusy(true);
                const res = await createSchedule({
                  name: scheduleName.trim(),
                  timezone,
                  isDefault,
                  slots,
                });
                setBusy(false);
                if (!res.ok) return alert(res.error);
                onClose();
              }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create
            </button>
          )}
        </div>
      </div>
    </div>
  );

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
}
