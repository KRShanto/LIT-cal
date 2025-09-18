"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import Drawer from "./ui/drawer";
import ScheduleSelect, { type ScheduleOption } from "./ui/schedule-select";
import QuestionsList, { type QuestionDraft } from "./questions-list";
import { createEventType } from "@/actions/event-types/create-event-type";
import { updateEventType } from "@/actions/event-types/update-event-type";
import { deleteEventType } from "@/actions/event-types/delete-event-type";
import { useRouter } from "next/navigation";

export type EventTypeFormValues = {
  title: string;
  slug: string;
  description: string;
  duration: number;
  scheduleId: string | null;
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const EventTypeForm = forwardRef(function EventTypeForm(
  {
    isOpen,
    onClose,
    schedules,
    isActive,
    isPublic,
    editingId,
  }: {
    isOpen: boolean;
    onClose: () => void;
    schedules: ScheduleOption[];
    isActive: boolean;
    isPublic: boolean;
    editingId?: string | null;
  },
  ref: React.Ref<{ getValues: () => EventTypeFormValues }>
) {
  const router = useRouter();
  // Primary fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  // Questions
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);
  // UI helpers
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollToEndOnNextPaint, setScrollToEndOnNextPaint] = useState(false);

  useEffect(() => {
    if (!scrollToEndOnNextPaint) return;
    const list = containerRef.current;
    const last = list?.lastElementChild as HTMLElement | null;
    if (last) last.scrollIntoView({ behavior: "smooth", block: "end" });
    setScrollToEndOnNextPaint(false);
  }, [scrollToEndOnNextPaint, questions.length]);

  const defaultScheduleId = useMemo(() => {
    const def = schedules.find((s) => s.isDefault);
    return def?.id ?? schedules[0]?.id ?? null;
  }, [schedules]);

  useEffect(() => {
    if (!scheduleId && defaultScheduleId) setScheduleId(defaultScheduleId);
  }, [defaultScheduleId, scheduleId]);

  useImperativeHandle(ref, () => ({
    getValues: () => ({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      duration,
      scheduleId,
    }),
  }));

  async function onCreate() {
    setBusy(true);
    const res = await createEventType({
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      durationMinutes: duration,
      scheduleId: scheduleId || undefined,
      isActive,
      isPublic,
      questions: questions.map((q) => ({
        idx: q.idx,
        question: q.question.trim(),
        type: q.type,
        required: q.required,
        options:
          q.type === "RADIO" || q.type === "CHECKBOX" || q.type === "DROPDOWN"
            ? (q.options ?? []).map((s) => s.trim()).filter(Boolean)
            : undefined,
      })),
    });
    setBusy(false);
    if (!res.ok) return alert(res.error);
    onClose();
    router.refresh();
  }

  async function onUpdate() {
    if (!editingId) return;
    setBusy(true);
    const res = await updateEventType({
      id: editingId,
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      durationMinutes: duration,
      scheduleId: scheduleId || undefined,
      isActive,
      isPublic,
      questions: questions.map((q) => ({
        idx: q.idx,
        question: q.question.trim(),
        type: q.type,
        required: q.required,
        options: q.options && q.options.length ? q.options : undefined,
      })),
    });
    setBusy(false);
    if (!res.ok) return alert(res.error);
    onClose();
    router.refresh();
  }

  async function onDelete() {
    if (!editingId) return;
    setBusy(true);
    const res = await deleteEventType(editingId);
    setBusy(false);
    if (!res.ok) return alert(res.error);
    onClose();
    router.refresh();
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? "Edit event type" : "New event type"}
    >
      <div className="space-y-6" ref={containerRef}>
        <div className="rounded-md border border-white/10 p-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <label className="text-base text-slate-300">Title</label>
              <input
                value={title}
                onChange={(e) => {
                  const v = e.target.value;
                  setTitle(v);
                  setSlug(toSlug(v));
                }}
                className="mt-1 h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Intro call"
              />
            </div>
            <div className="space-y-3">
              <label className="text-base text-slate-300">Slug</label>
              <input
                value={slug}
                readOnly
                className="mt-1 h-11 w-full cursor-not-allowed rounded-md border border-white/10 bg-neutral-900/60 px-3 text-base text-slate-400 outline-none"
                placeholder="intro-call"
              />
            </div>
            <div className="space-y-3">
              <label className="text-base text-slate-300">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) =>
                  setDuration(parseInt(e.target.value || "0", 10))
                }
                className="mt-1 h-11 w-full rounded-md border border-white/10 bg-neutral-950 px-3 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-base text-slate-300">
                Availability schedule
              </label>
              <ScheduleSelect
                value={scheduleId ?? ""}
                options={schedules}
                onChange={(val) => setScheduleId(val)}
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-base text-slate-300">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 min-h-24 w-full rounded-md border border-white/10 bg-neutral-950 px-3 py-2 text-base text-slate-100 outline-none focus:ring-2 focus:ring-primary"
                placeholder="What is this meeting about?"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-white/10 p-4">
          <h3 className="mb-3 text-base font-medium text-white">Questions</h3>
          <QuestionsList
            questions={questions}
            onChange={(next) => setQuestions(next)}
          />
          <button
            type="button"
            onClick={() => {
              setQuestions((prev) => [
                ...prev,
                {
                  idx: prev.length,
                  question: "",
                  type: "SHORT_TEXT",
                  required: false,
                  options: [],
                  expanded: true,
                },
              ]);
              setScrollToEndOnNextPaint(true);
            }}
            className="mt-5 rounded-md border border-white/10 px-3 py-2 text-slate-200 hover:bg-white/5"
          >
            Add question
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          {editingId && (
            <button
              type="button"
              disabled={busy}
              onClick={onUpdate}
              className="rounded-md border border-white/10 px-3 py-2 text-slate-200 hover:bg-white/5"
            >
              Save
            </button>
          )}
          {editingId && (
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="rounded-md border border-red-600/40 bg-red-600/20 px-3 py-2 text-red-300 hover:bg-red-600/30"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create
          </button>
        </div>
      </div>
    </Drawer>
  );
});

export default EventTypeForm;
