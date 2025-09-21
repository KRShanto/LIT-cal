"use client";

import React from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toZonedTime } from "date-fns-tz";
import Drawer from "../../../components/ui/drawer";

type Booking = {
  id: string;
  inviteeName: string;
  inviteeEmail: string;
  inviteePhone: string | null;
  startAt: Date;
  endAt: Date;
  timezone: string;
  eventType: {
    id: string;
    title: string;
    slug: string;
    durationMinutes: number;
  };
  contact: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
  } | null;
  answers: {
    id: string;
    question: {
      idx: number;
      question: string;
      type: string;
    };
    value: string | string[] | number | boolean;
  }[];
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  userTimezone: string;
};

/**
 * MeetingDetailsDrawer
 * Displays detailed information about a selected meeting in a drawer.
 * Shows all meeting details, contact information, and question answers.
 */
export default function MeetingDetailsDrawer({
  isOpen,
  onClose,
  booking,
  userTimezone,
}: Props) {
  // If no booking is selected, render the drawer as closed
  if (!booking) {
    return (
      <Drawer isOpen={false} onClose={onClose} title="Meeting Details">
        <div></div>
      </Drawer>
    );
  }

  /**
   * Formats a date for display in the user's timezone.
   * @param utcDate - The UTC date from database
   * @returns Formatted date string in user's timezone
   */
  function formatDate(utcDate: Date): string {
    const userDate = toZonedTime(utcDate, userTimezone);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(userDate);
  }

  /**
   * Formats time for display in the user's timezone.
   * @param utcDate - The UTC date from database
   * @returns Formatted time string in user's timezone
   */
  function formatTime(utcDate: Date): string {
    const userDate = toZonedTime(utcDate, userTimezone);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(userDate);
  }

  /**
   * Formats time for display in the invitee's timezone.
   * @param utcDate - The UTC date from database
   * @param timezone - The timezone to format for
   * @returns Formatted time string in the specified timezone
   */
  function formatTimeInTimezone(utcDate: Date, timezone: string): string {
    const zonedDate = toZonedTime(utcDate, timezone);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(zonedDate);
  }

  /**
   * Gets the status of a booking based on current time.
   * @param startAt - Booking start time
   * @param endAt - Booking end time
   * @returns Status object with text and styling
   */
  function getBookingStatus(startAt: Date, endAt: Date) {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);

    if (now < start) {
      return {
        text: "Upcoming",
        icon: Clock,
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    } else if (now >= start && now <= end) {
      return {
        text: "Ongoing",
        icon: CheckCircle,
        className: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    } else {
      return {
        text: "Completed",
        icon: XCircle,
        className: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
      };
    }
  }

  /**
   * Formats answer values for display.
   * @param value - The answer value
   * @returns Formatted string
   */
  function formatAnswerValue(
    value: string | string[] | number | boolean
  ): string {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  }

  const status = getBookingStatus(booking.startAt, booking.endAt);
  const StatusIcon = status.icon;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Meeting Details">
      <div className="space-y-6">
        {/* Meeting Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-2">
                {booking.eventType.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(booking.startAt)}</span>
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 flex-shrink-0 ${status.className}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.text}
            </div>
          </div>
        </div>

        {/* Time and Duration */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-base font-semibold text-white mb-3">Schedule</h4>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">
                    Invitee&apos;s Time
                  </div>
                  <div className="text-sm font-medium text-white">
                    {formatTimeInTimezone(booking.startAt, booking.timezone)} -{" "}
                    {formatTimeInTimezone(booking.endAt, booking.timezone)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {booking.timezone} • {booking.eventType.durationMinutes}{" "}
                    minutes
                  </div>
                </div>
              </div>
            </div>

            {booking.timezone !== userTimezone && (
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-400">Your Time</div>
                    <div className="text-sm font-medium text-white">
                      {formatTime(booking.startAt)} -{" "}
                      {formatTime(booking.endAt)}
                    </div>
                    <div className="text-xs text-slate-400">{userTimezone}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-base font-semibold text-white mb-3">
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-400">Name</div>
                <div className="text-sm text-white">{booking.inviteeName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-400">Email</div>
                <div className="text-sm text-white">{booking.inviteeEmail}</div>
              </div>
            </div>
            {booking.inviteePhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-400">Phone</div>
                  <div className="text-sm text-white">
                    {booking.inviteePhone}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Question Answers */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-base font-semibold text-white mb-3">
            Additional Information
          </h4>
          {booking.answers.length > 0 ? (
            <div className="space-y-3">
              {booking.answers.map((answer) => (
                <div key={answer.id} className="space-y-1">
                  <div className="text-xs font-medium text-slate-300">
                    {answer.question.question}
                  </div>
                  <div className="text-sm text-white bg-neutral-900/50 rounded-lg p-2">
                    {formatAnswerValue(answer.value)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              No additional information provided
            </div>
          )}
        </div>

        {/* Meeting Actions */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <h4 className="text-base font-semibold text-white mb-3">Actions</h4>
          <div className="flex gap-2">
            <button className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              Reschedule
            </button>
            <button className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
