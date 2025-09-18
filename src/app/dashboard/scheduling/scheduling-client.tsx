"use client";

import React, { useState } from "react";
import { type ScheduleOption } from "./ui/schedule-select";
import EventTypeForm from "./event-type-form";

export default function SchedulingClient({
  schedules = [],
}: {
  schedules?: ScheduleOption[];
}) {
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Scheduling</h1>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setDrawerOpen(true);
          }}
          className="rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:opacity-95"
        >
          New event type
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-md border border-white/10 p-4 text-slate-400">
            Your event types will appear here after creation.
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-md border border-white/10 p-4">
            <h3 className="mb-3 text-base font-medium text-white">
              Visibility & Schedule
            </h3>
            <label className="mb-3 flex items-center justify-between text-slate-200">
              <span>Active</span>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </label>
            <label className="mb-3 flex items-center justify-between text-slate-200">
              <span>Public</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </label>
          </div>

          <div className="rounded-md border border-white/10 p-4 text-slate-400">
            Select an event type to edit or delete (coming soon).
          </div>
        </div>
      </div>

      <EventTypeForm
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        schedules={schedules}
        isActive={isActive}
        isPublic={isPublic}
        editingId={editingId}
      />
    </div>
  );
}
