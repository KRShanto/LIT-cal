"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { deleteSchedule } from "@/actions/schedules/delete-schedule";

type Props = {
  title: string;
  message: React.ReactNode;
  isOpen: boolean;
  visible: boolean;
  onCancel: () => void;
  // If scheduleId is provided, this component will run the delete logic itself
  scheduleId?: string;
};

export default function ConfirmModal({
  title,
  message,
  isOpen,
  visible,
  onCancel,
  scheduleId,
}: Props) {
  const [busy, setBusy] = useState(false);
  if (!isOpen) return null;

  const onConfirm = async () => {
    if (!scheduleId) return;
    setBusy(true);
    const res = await deleteSchedule(scheduleId);
    setBusy(false);
    if (!res.ok) {
      alert(res.error);
      return;
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onCancel}
      />
      <div
        className={`relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-neutral-950 shadow-xl transition-transform duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="border-b border-white/10 px-4 py-3">
          <h3 className="text-base font-medium text-white">{title}</h3>
        </div>
        <div className="px-4 py-4 text-slate-300">{message}</div>
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete
          </button>
        </div>
      </div>
    </div>
  );
}
