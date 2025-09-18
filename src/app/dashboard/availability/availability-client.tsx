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
  // Modal state: create/edit dialog
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [isCreateEditVisible, setIsCreateEditVisible] = useState(false);
  const [prefillSlots, setPrefillSlots] = useState<Slot[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Delete confirmation state
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  function openConfirmDialog(data: { id: string; name: string }) {
    setConfirmTarget(data);
    setTimeout(() => setIsConfirmVisible(true), 0);
  }

  function closeConfirmDialog() {
    setIsConfirmVisible(false);
    setTimeout(() => setConfirmTarget(null), 180);
  }

  function resetForm() {
    setPrefillSlots([]);
  }

  function openCreateModal() {
    setIsCreateEditOpen(true);
    setTimeout(() => setIsCreateEditVisible(true), 0);
  }

  function closeCreateModal() {
    setIsCreateEditVisible(false);
    setTimeout(() => {
      setIsCreateEditOpen(false);
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
            setEditingSchedule(sch as unknown as Schedule);
            setPrefillSlots(
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
        isOpen={isCreateEditOpen}
        visible={isCreateEditVisible}
        defaultTimezone={defaultTimezone}
        editing={
          editingSchedule
            ? {
                id: editingSchedule.id,
                name: editingSchedule.name,
                timezone: editingSchedule.timezone,
                isDefault: editingSchedule.isDefault,
                slots: prefillSlots,
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
            Are you sure you want to delete &quot;{confirmTarget?.name}&quot;?
            This cannot be undone.
          </span>
        }
        isOpen={Boolean(confirmTarget)}
        visible={isConfirmVisible}
        onCancel={closeConfirmDialog}
        scheduleId={confirmTarget?.id}
      />
    </div>
  );
}
