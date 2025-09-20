"use client";

import React, { useState } from "react";
import { type ScheduleOption } from "./ui/schedule-select";
import EventTypeForm, { type EventTypeFormValues } from "./event-type-form";
import { type QuestionDraft } from "./questions-list";
import { type QuestionType } from "./ui/type-select";

type QuestionSeed = {
  idx: number;
  question: string;
  type: QuestionType;
  required: boolean;
  options: string[] | null;
};

type EventTypeItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  scheduleId: string | null;
  isActive: boolean;
  questions?: QuestionSeed[];
};

export default function SchedulingClient({
  schedules = [],
  eventTypes = [],
}: {
  schedules?: ScheduleOption[];
  eventTypes?: EventTypeItem[];
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [initial, setInitial] = useState<
    (Partial<EventTypeFormValues> & { questions?: QuestionDraft[] }) | null
  >(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Scheduling</h1>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setInitial(null);
            setIsActive(true);
            setDrawerOpen(true);
          }}
          className="rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95"
        >
          New event type
        </button>
      </div>

      {eventTypes.length === 0 ? (
        <div className="rounded-md border border-white/10 p-6 text-slate-400">
          No event types yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((et) => (
            <button
              key={et.id}
              type="button"
              onClick={() => {
                setEditingId(et.id);
                setIsActive(et.isActive);
                const questions: QuestionDraft[] = (et.questions || []).map(
                  (q) => ({
                    idx: q.idx,
                    question: q.question,
                    type: q.type,
                    required: q.required,
                    options: q.options || [],
                    expanded: false,
                  })
                );
                setInitial({
                  title: et.title,
                  slug: et.slug,
                  description: et.description ?? "",
                  duration: et.durationMinutes,
                  scheduleId: et.scheduleId,
                  questions,
                });
                setDrawerOpen(true);
              }}
              className="group rounded-xl border border-white/10 bg-neutral-950/60 p-4 text-left shadow-base ring-1 ring-transparent transition hover:bg-white/5 hover:ring-white/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-medium text-white">
                    {et.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-base text-slate-400">
                    {et.description || "No description"}
                  </p>
                </div>
                <span className="shrink-0 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                  {et.durationMinutes} min
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span
                  className={`rounded px-2 py-0.5 ${
                    et.isActive
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                  }`}
                >
                  {et.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <EventTypeForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        schedules={schedules}
        isActive={isActive}
        onIsActiveChange={setIsActive}
        editingId={editingId}
        initial={initial ?? undefined}
      />
    </div>
  );
}
