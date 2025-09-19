"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { type EventType } from "../types";
import TimezonePicker from "@/components/timezone-picker";

type AvailabilityData = {
  date: string; // YYYY-MM-DD format
  timeSlots: string[]; // Array of available time slots
};

type Props = {
  eventType: EventType;
  onDateTimeSelected: (date: Date, time: string, timezone: string) => void;
  initialAvailability?: AvailabilityData[];
  hostTimezone?: string;
};

/**
 * DateTimePicker
 * Component for selecting date and time for the booking.
 * Custom calendar implementation with real availability data and improved UI.
 */
export default function DateTimePicker({
  onDateTimeSelected,
  initialAvailability = [],
  hostTimezone = "UTC",
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] =
    useState<AvailabilityData[]>(initialAvailability);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  /**
   * Load server-provided availability. No client-side generation or month filtering.
   */
  useEffect(() => {
    setAvailability(initialAvailability || []);
  }, [initialAvailability]);

  /**
   * Updates time slots when timezone changes.
   * Re-renders the time picker with converted time slots.
   */
  useEffect(() => {
    // Force re-render of time slots when timezone changes
    if (selectedDate) {
      // This will trigger a re-render of the time picker
      setSelectedTime(null);
    }
  }, [timezone, selectedDate]);

  /**
   * Navigates to the previous month.
   */
  function goToPreviousMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  }

  /**
   * Navigates to the next month.
   */
  function goToNextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  }

  /**
   * Handles date selection.
   * @param date - The selected date
   */
  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
    setShowTimePicker(true); // Show time picker after date selection
  }

  /**
   * Handles going back to calendar view.
   */
  function handleBackToCalendar() {
    setShowTimePicker(false);
    setSelectedTime(null);
  }

  /**
   * Handles time selection and triggers the callback.
   * @param time - The selected time
   */
  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelected(selectedDate, time, timezone);
    }
  }

  /**
   * Gets the available time slots for the selected date.
   * @returns Array of available time slots converted to user's timezone
   */
  function getSelectedDateTimeSlots(): string[] {
    if (!selectedDate) return [];
    const originalTimeSlots = getAvailableTimeSlots(selectedDate);
    return convertTimeSlotsToUserTimezone(
      originalTimeSlots,
      selectedDate,
      hostTimezone,
      timezone
    );
  }

  /**
   * Gets the days in the current month.
   */
  function getDaysInMonth() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  /**
   * Formats a date to YYYY-MM-DD string.
   * @param date - The date to format
   * @returns Formatted date string
   */
  function formatDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Gets available time slots for a specific date.
   * @param date - The date to check
   * @returns Array of available time slots
   */
  function getAvailableTimeSlots(date: Date): string[] {
    const dateString = formatDateString(date);
    const dayAvailability = availability.find((day) => day.date === dateString);
    return dayAvailability?.timeSlots || [];
  }

  /**
   * Converts time slots from host timezone to user's selected timezone.
   * @param timeSlots - Array of time slots in host timezone
   * @param date - The date for the time slots
   * @param hostTimezone - The host's timezone (from availability data)
   * @param userTimezone - The user's selected timezone
   * @returns Array of time slots converted to user's timezone
   */
  function convertTimeSlotsToUserTimezone(
    timeSlots: string[],
    date: Date,
    hostTimezone: string,
    userTimezone: string
  ): string[] {
    if (hostTimezone === userTimezone) {
      return timeSlots; // No conversion needed
    }

    return timeSlots.map((timeSlot) => {
      try {
        // Parse the time slot (e.g., "9:00am")
        const [time, period] = timeSlot.replace(/\s/g, "").split(/(am|pm)/i);
        const [hours, minutes] = time.split(":").map(Number);

        let hour24 = hours;
        if (period.toLowerCase() === "pm" && hours !== 12) {
          hour24 += 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
          hour24 = 0;
        }

        // Create a date in the host's timezone
        const hostDate = new Date(date);
        hostDate.setHours(hour24, minutes, 0, 0);

        // Convert to user's timezone
        const userDate = new Date(
          hostDate.toLocaleString("en-US", { timeZone: userTimezone })
        );
        const userHour = userDate.getHours();
        const userMinute = userDate.getMinutes();

        // Convert back to 12-hour format
        const displayHour =
          userHour === 0 ? 12 : userHour > 12 ? userHour - 12 : userHour;
        const displayMinute = userMinute.toString().padStart(2, "0");
        const period12 = userHour >= 12 ? "pm" : "am";

        return `${displayHour}:${displayMinute}${period12}`;
      } catch (error) {
        console.error("Error converting time slot:", error);
        return timeSlot; // Return original if conversion fails
      }
    });
  }

  /**
   * Checks if a date is available for booking.
   * @param date - The date to check
   * @returns True if the date is available
   */
  function isDateAvailable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // Must be today or in the future
    if (date < today) return false;

    // Available only if server-provided availability contains slots for this day
    const timeSlots = getAvailableTimeSlots(date);
    return timeSlots.length > 0;
  }

  /**
   * Checks if a date is today.
   * @param date - The date to check
   * @returns True if the date is today
   */
  function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  const days = getDaysInMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-white/10 p-6">
        <div className="space-y-6">
          <label className="text-xl font-semibold text-slate-200">
            Select a Date & Time
          </label>

          {!showTimePicker ? (
            /* Calendar View */
            <div className="space-y-6">
              <div className="rounded-xl border border-white/5 bg-neutral-900/30 p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    type="button"
                    onClick={goToPreviousMonth}
                    className="p-3 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <h3 className="text-2xl font-bold text-white">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                  </h3>

                  <button
                    type="button"
                    onClick={goToNextMonth}
                    className="p-3 hover:bg-white/10 rounded-xl text-slate-300 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-slate-400 py-3"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="h-16" />;
                    }

                    const isAvailable = isDateAvailable(date);
                    const isTodayDate = isToday(date);

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => isAvailable && handleDateSelect(date)}
                        disabled={!isAvailable}
                        className={`h-16 w-full rounded-xl text-lg font-medium transition-all duration-200 ${
                          isTodayDate
                            ? "bg-primary/20 text-primary border-2 border-primary/40 hover:bg-primary/30"
                            : isAvailable
                            ? "text-white hover:bg-white/10 hover:scale-105 border border-transparent hover:border-white/20"
                            : "text-slate-500 cursor-not-allowed opacity-40"
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Zone Selector */}
              <div className="space-y-2">
                <label className="block text-base font-medium text-slate-200">
                  Timezone
                </label>
                <TimezonePicker
                  value={timezone}
                  onChange={setTimezone}
                  placeholder="Select timezone"
                  size="md"
                  background="input"
                />
              </div>
            </div>
          ) : (
            /* Time Picker View */
            <div className="space-y-6">
              {/* Back Button and Selected Date */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBackToCalendar}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to calendar
                </button>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="text-base font-medium text-primary">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Available Time Slots */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <label className="text-lg font-semibold text-slate-200">
                    Available times
                  </label>
                </div>

                {getSelectedDateTimeSlots().length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                    {getSelectedDateTimeSlots().map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`px-6 py-4 text-base font-medium rounded-lg border transition-all duration-200 ${
                          selectedTime === time
                            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                            : "border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 hover:scale-105"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No available times for this date</p>
                  </div>
                )}
              </div>

              {/* Troubleshoot Button */}
              <div className="pt-4">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Troubleshoot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
