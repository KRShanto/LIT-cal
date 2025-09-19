"use client";

import React from "react";
import { CheckCircle, Calendar, User, Globe, ExternalLink } from "lucide-react";
import { type EventType, type User as UserType } from "../types";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  eventType: EventType;
  user: UserType;
  selectedDate: Date;
  selectedTime: string;
  timezone: string;
  durationMinutes: number;
};

/**
 * BookingSuccessModal
 * Displays a success confirmation after booking is created.
 * Shows meeting details and LIT Cal branding.
 */
export default function BookingSuccessModal({
  isOpen,
  eventType,
  user,
  selectedDate,
  selectedTime,
  timezone,
  durationMinutes,
}: Props) {
  const router = useRouter();
  if (!isOpen) return null;

  // Calculate end time
  const [time, period] = selectedTime.replace(/\s/g, "").split(/(am|pm)/i);
  const [hours, minutes] = time.split(":").map(Number);

  let hour24 = hours;
  if (period.toLowerCase() === "pm" && hours !== 12) {
    hour24 += 12;
  } else if (period.toLowerCase() === "am" && hours === 12) {
    hour24 = 0;
  }

  const startTime = new Date(selectedDate);
  startTime.setHours(hour24, minutes, 0, 0);

  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + durationMinutes);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-white/10 p-8 shadow-2xl">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">You are scheduled</h2>
        <p className="mt-2 text-slate-400">
          A calendar invitation has been sent to your email address.
        </p>
      </div>

      {/* Meeting Details Card */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {eventType.title}
        </h3>

        <div className="space-y-3">
          {/* Host */}
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-300">{user.name}</span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-300">
              {formatTime(startTime)} - {formatTime(endTime)},{" "}
              {formatDate(selectedDate)}
            </span>
          </div>

          {/* Timezone */}
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-300">{timezone}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            // TODO: Open email invitation later
            window.open("https://google.com", "_blank");
          }}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Open Invitation
        </button>

        <button
          onClick={() => router.push(process.env.NEXT_PUBLIC_APP_URL || "")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-3 w-3" />
          Visit LIT Cal
        </button>
      </div>

      {/* LIT Cal Branding */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Powered by</span>
          <span className="font-semibold text-primary">LIT Cal</span>
          <span>•</span>
          <a
            href="https://www.krshanto.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            krshanto.com
          </a>
        </div>
      </div>
    </div>
  );
}
