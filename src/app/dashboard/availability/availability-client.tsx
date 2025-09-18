"use client";

import React, { useState } from "react";
import { CalendarPlus } from "lucide-react";
import ConfirmModal from "./confirm-modal";
import SchedulesList, { type Schedule as ScheduleCard } from "./schedules-list";
import CreateEditModal from "./create-edit-modal";

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

type Schedule = {
  id: string;
  name: string;
  isDefault: boolean;
  timezone: string | null;
  createdAt: string | Date;
  slots: {
    id: string;
    weekday: Weekday;
    startMinutes: number;
    endMinutes: number;
  }[];
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
export default function AvailabilityClient({
  defaultTimezone = "",
  schedules = [],
}: {
  defaultTimezone?: string;
  schedules?: Schedule[];
}) {
  const [open, setOpen] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]); // prefill for modal
  const [confirmOpen, setConfirmOpen] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  // handled in child modals
  const [editing, setEditing] = useState<Schedule | null>(null);
  // handled in child modals

  function openConfirmDialog(data: { id: string; name: string }) {
    setConfirmOpen(data);
    setTimeout(() => setConfirmVisible(true), 0);
  }

  function closeConfirmDialog() {
    setConfirmVisible(false);
    setTimeout(() => setConfirmOpen(null), 180);
  }
  // Simple confirm modal state (no close animation)

  // Note: per-slot removal UI is not present in the current design.
  // If needed later, implement removeSlot and expose remove controls.

  function resetForm() {
    setSlots([]);
  }

  function openCreateModal() {
    setOpen(true);
    setTimeout(() => setCreateVisible(true), 0);
  }

  function closeCreateModal() {
    setCreateVisible(false);
    setTimeout(() => {
      setOpen(false);
      resetForm();
    }, 180);
  }

  // submit handled in CreateEditModal

  // grouping now handled by CreateEditModal weekly summary

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
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <CalendarPlus className="h-4 w-4" /> Create availability
        </button>
      </div>

      {/* Schedules list */}
      <div className="rounded-lg border border-white/10 bg-neutral-950/40 backdrop-blur">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-medium text-white">Your schedules</h2>
        </div>
        <SchedulesList
          schedules={schedules}
          onEdit={(sch: ScheduleCard) => {
            setEditing(sch as unknown as Schedule);
            setSlots(
              (sch.slots || []).map((s) => ({
                weekday: s.weekday,
                startMinutes: s.startMinutes,
                endMinutes: s.endMinutes,
              }))
            );
            openCreateModal();
          }}
          onDelete={(sch: ScheduleCard) =>
            openConfirmDialog({ id: sch.id, name: sch.name })
          }
        />
      </div>

      {/* Create/Edit modal */}
      <CreateEditModal
        isOpen={open}
        visible={createVisible}
        defaultTimezone={defaultTimezone}
        editing={
          editing
            ? {
                id: editing.id,
                name: editing.name,
                timezone: editing.timezone,
                isDefault: editing.isDefault,
                slots: slots,
              }
            : null
        }
        onClose={closeCreateModal}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        title="Delete schedule"
        message={
          <span>
            Are you sure you want to delete &quot;{confirmOpen?.name}&quot;?
            This cannot be undone.
          </span>
        }
        isOpen={Boolean(confirmOpen)}
        visible={confirmVisible}
        onCancel={closeConfirmDialog}
        scheduleId={confirmOpen?.id}
      />
    </div>
  );
}
