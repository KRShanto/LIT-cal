"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import TypeSelect, { QuestionType } from "./ui/type-select";

export type QuestionDraft = {
  idx: number;
  question: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  expanded?: boolean;
};

export default function QuestionsList({
  questions,
  onChange,
}: {
  questions: QuestionDraft[];
  onChange: (next: QuestionDraft[]) => void;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevRectsRef = useRef<Map<Element, DOMRect>>(new Map());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverPos, setDragOverPos] = useState<"before" | "after" | null>(
    null
  );

  const orderSignature = useMemo(
    () => `${questions.map((q) => q.idx).join("|")}|len:${questions.length}`,
    [questions]
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const children = Array.from(el.children);
    const newRects = new Map<Element, DOMRect>();
    children.forEach((child) =>
      newRects.set(child, child.getBoundingClientRect())
    );
    children.forEach((child) => {
      const prev = prevRectsRef.current.get(child);
      const next = newRects.get(child)!;
      if (prev) {
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (dx || dy) {
          try {
            (child as HTMLElement).animate(
              [
                { transform: `translate(${dx}px, ${dy}px)` },
                { transform: "translate(0, 0)" },
              ],
              { duration: 180, easing: "ease-out" }
            );
          } catch {}
        }
      }
    });
    prevRectsRef.current = newRects;
  }, [orderSignature]);

  function patchAt(index: number, patch: Partial<QuestionDraft>) {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function addOption(qIndex: number) {
    onChange(
      questions.map((q, i) =>
        i === qIndex ? { ...q, options: [...(q.options ?? []), ""] } : q
      )
    );
  }
  function updateOption(qIndex: number, optIndex: number, value: string) {
    onChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q;
        const opts = [...(q.options ?? [])];
        opts[optIndex] = value;
        return { ...q, options: opts };
      })
    );
  }
  function removeOption(qIndex: number, optIndex: number) {
    onChange(
      questions.map((q, i) => {
        if (i !== qIndex) return q;
        const opts = (q.options ?? []).filter((_, j) => j !== optIndex);
        return { ...q, options: opts };
      })
    );
  }

  function removeQuestion(index: number) {
    const el = listRef.current;
    const child = el
      ? (el.children[index] as HTMLElement | undefined)
      : undefined;
    if (child && typeof child.animate === "function") {
      try {
        const anim = child.animate(
          [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(0.97)" },
          ],
          { duration: 160, easing: "ease-in" }
        );
        anim.onfinish = () =>
          onChange(
            questions
              .filter((_, i) => i !== index)
              .map((q, i) => ({ ...q, idx: i }))
          );
        return;
      } catch {}
    }
    onChange(
      questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, idx: i }))
    );
  }

  return (
    <div ref={listRef} className="space-y-5">
      {questions.map((q, index) => {
        const isOpen = q.expanded !== false;
        const isDragOver = dragOverIndex === index && dragIndex !== index;
        const dropLineTop = isDragOver && dragOverPos === "before";
        const dropLineBottom = isDragOver && dragOverPos === "after";
        const isDraggingSelf = dragIndex === index;

        const rawTitle = (q.question || "Untitled question").trim();
        const headerTitle =
          rawTitle.length > 50 ? rawTitle.slice(0, 55) + "..." : rawTitle;
        const typeBadge = q.type
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div
            key={index}
            className={`rounded border border-white/10 transition-colors ${
              isDragOver ? "bg-white/5" : ""
            } ${isDraggingSelf ? "opacity-70 ring-1 ring-primary/40" : ""}`}
          >
            {dropLineTop && <div className="h-0.5 w-full bg-primary" />}
            <div
              className={`flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2 ${
                isDraggingSelf ? "cursor-grabbing" : "cursor-grab"
              }`}
              draggable
              onDragStart={(e) => {
                setDragIndex(index);
                try {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(index));
                } catch {}
              }}
              onDragOver={(e) => {
                e.preventDefault();
                const rect = (
                  e.currentTarget as HTMLDivElement
                ).getBoundingClientRect();
                const halfway = rect.top + rect.height / 2;
                setDragOverIndex(index);
                setDragOverPos(e.clientY < halfway ? "before" : "after");
              }}
              onDragLeave={() => {
                setDragOverIndex(null);
                setDragOverPos(null);
              }}
              onDrop={() => {
                if (dragIndex === null) return;
                let toIndex = index;
                if (dragOverPos === "after") toIndex = index + 1;
                onChange(
                  (() => {
                    const next = [...questions];
                    const [moved] = next.splice(dragIndex, 1);
                    if (dragIndex < toIndex) toIndex -= 1;
                    next.splice(toIndex, 0, moved);
                    return next.map((it, i) => ({ ...it, idx: i }));
                  })()
                );
                setDragIndex(null);
                setDragOverIndex(null);
                setDragOverPos(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setDragOverIndex(null);
                setDragOverPos(null);
              }}
            >
              <div className="flex items-center gap-3 text-slate-300">
                <GripVertical className="h-4 w-4 text-slate-500" />
                <span className="line-clamp-1 max-w-[60ch] text-sm text-slate-200">
                  {headerTitle}
                </span>
                <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300 text-nowrap">
                  {typeBadge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="rounded-md border border-white/10 px-2 py-1 text-slate-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/40"
                  aria-label="Delete question"
                  title="Delete question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => patchAt(index, { expanded: !isOpen })}
                  className="rounded-md border border-white/10 px-2 py-1 text-slate-200 hover:bg-white/5"
                  aria-expanded={isOpen}
                  aria-label="Toggle question"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-3">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[220px] space-y-3">
                    <label className="text-base text-slate-300">Question</label>
                    <input
                      value={q.question}
                      onChange={(e) =>
                        patchAt(index, { question: e.target.value })
                      }
                      placeholder="Question"
                      className="mt-1 h-9 w-full rounded-md border border-white/10 bg-neutral-950 px-2 text-sm text-slate-100 outline-none"
                    />
                  </div>
                  <div className="w-56 space-y-3">
                    <label className="text-base text-slate-300">Type</label>
                    <TypeSelect
                      value={q.type}
                      onChange={(newType) =>
                        patchAt(index, {
                          type: newType,
                          options:
                            newType === "RADIO" ||
                            newType === "CHECKBOX" ||
                            newType === "DROPDOWN"
                              ? []
                              : undefined,
                        })
                      }
                    />
                  </div>

                  {(q.type === "RADIO" ||
                    q.type === "CHECKBOX" ||
                    q.type === "DROPDOWN") && (
                    <div className="w-full space-y-2">
                      {(q.options ?? []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateOption(index, optIdx, e.target.value)
                            }
                            placeholder={`Option ${optIdx + 1}`}
                            className="mt-1 h-9 flex-1 rounded-md border border-white/10 bg-neutral-950 px-2 text-sm text-slate-100 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index, optIdx)}
                            className="rounded border border-white/10 px-2 py-1 text-sm text-slate-200 hover:bg-white/5"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
                      >
                        Add option
                      </button>
                    </div>
                  )}

                  <div className="w-full">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={q.required}
                        onChange={(e) =>
                          patchAt(index, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>
                  </div>
                </div>
              </div>
            )}

            {dropLineBottom && <div className="h-0.5 w-full bg-primary" />}
          </div>
        );
      })}
    </div>
  );
}
