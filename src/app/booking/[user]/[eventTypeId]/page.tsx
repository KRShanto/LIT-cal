import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import BookingForm from "./booking-form";
import { toZonedTime } from "date-fns-tz";

type AvailabilityData = {
  date: string; // YYYY-MM-DD format
  timeSlots: string[]; // Array of available time slots
};

type Props = {
  params: {
    user: string;
    eventTypeId: string;
  };
};

/**
 * Generates availability data for the next 3 months based on the schedule.
 * Time slot spacing respects the event type duration (in minutes).
 * Excludes already booked time slots.
 * @param schedule - The schedule with availability slots
 * @param eventDurationMinutes - Event duration in minutes
 * @param eventTypeId - The event type ID to check for existing bookings
 * @param hostTimezone - The host's timezone for proper time conversion
 * @returns Array of availability data for the next 3 months
 */
async function generateAvailabilityData(
  schedule: {
    slots: { weekday: string; startMinutes: number; endMinutes: number }[];
  } | null,
  eventDurationMinutes: number,
  eventTypeId: string,
  hostTimezone: string
): Promise<AvailabilityData[]> {
  const availability: AvailabilityData[] = [];
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 3); // Generate for next 3 months

  // Create a map of weekday availability
  const weekdayAvailability = new Map<
    number,
    { startMinutes: number; endMinutes: number }[]
  >();

  // Map Prisma Weekday enum (MONDAY..SUNDAY) to JS getDay() (0..6, Sunday=0)
  function mapWeekdayToJs(weekday: string): number {
    switch (weekday) {
      case "SUNDAY":
        return 0;
      case "MONDAY":
        return 1;
      case "TUESDAY":
        return 2;
      case "WEDNESDAY":
        return 3;
      case "THURSDAY":
        return 4;
      case "FRIDAY":
        return 5;
      case "SATURDAY":
        return 6;
      default:
        return -1;
    }
  }

  if (schedule?.slots) {
    schedule.slots.forEach((slot) => {
      const weekday = mapWeekdayToJs(slot.weekday);
      if (weekday < 0) return;
      if (!weekdayAvailability.has(weekday)) {
        weekdayAvailability.set(weekday, []);
      }
      weekdayAvailability.get(weekday)!.push({
        startMinutes: slot.startMinutes,
        endMinutes: slot.endMinutes,
      });
    });
  }

  // Fetch existing bookings for this event type
  const existingBookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventTypeId,
      startAt: {
        gte: today,
        lte: endDate,
      },
    },
    select: {
      startAt: true,
      endAt: true,
    },
  });

  // Create a map of booked time slots by date
  const bookedSlotsByDate = new Map<string, Set<string>>();
  existingBookings.forEach((booking) => {
    // Convert UTC booking time to host's timezone
    const hostDate = toZonedTime(booking.startAt, hostTimezone);
    const dateStr = hostDate.toISOString().split("T")[0];

    if (!bookedSlotsByDate.has(dateStr)) {
      bookedSlotsByDate.set(dateStr, new Set());
    }

    // Convert booking time to time slot format in host's timezone
    const startHour = hostDate.getHours();
    const startMinute = hostDate.getMinutes();
    const timeSlot = formatTime(startHour, startMinute);
    bookedSlotsByDate.get(dateStr)!.add(timeSlot);
  });

  // Generate availability for each day
  for (
    let date = new Date(today);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();
    const daySlots = weekdayAvailability.get(dayOfWeek);

    if (daySlots && daySlots.length > 0) {
      const timeSlotsSet = new Set<string>();

      daySlots.forEach((slot) => {
        // Generate time slots stepped by eventDurationMinutes
        // Include a start if the meeting can finish by endMinutes
        for (
          let start = slot.startMinutes;
          start + eventDurationMinutes <= slot.endMinutes;
          start += eventDurationMinutes
        ) {
          const hour = Math.floor(start / 60);
          const min = start % 60;
          const timeString = formatTime(hour, min);
          timeSlotsSet.add(timeString);
        }
      });

      const allTimeSlots = Array.from(timeSlotsSet).sort((a, b) => {
        // Sort by actual time
        const toMinutes = (t: string) => {
          const match = t.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
          if (!match) return 0;
          let h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const ampm = match[3].toLowerCase();
          if (ampm === "pm" && h !== 12) h += 12;
          if (ampm === "am" && h === 12) h = 0;
          return h * 60 + m;
        };
        return toMinutes(a) - toMinutes(b);
      });

      // Filter out booked time slots
      const dateStr = date.toISOString().split("T")[0];
      const bookedSlots = bookedSlotsByDate.get(dateStr) || new Set();
      const availableTimeSlots = allTimeSlots.filter(
        (slot) => !bookedSlots.has(slot)
      );

      if (availableTimeSlots.length > 0) {
        availability.push({
          date: dateStr,
          timeSlots: availableTimeSlots,
        });
      }
    }
  }

  return availability;
}

/**
 * Formats time in 12-hour format with AM/PM.
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @returns Formatted time string
 */
function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "pm" : "am";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute}${period}`;
}

/**
 * Fetches event type data with user information and availability for booking.
 * @param username - The username from the URL parameter
 * @param eventTypeSlug - The event type slug from the URL parameter
 * @returns Event type data with user info and availability or null if not found
 */
async function getEventTypeForBooking(username: string, eventTypeSlug: string) {
  try {
    const eventType = await prisma.eventType.findFirst({
      where: {
        slug: eventTypeSlug,
        isActive: true,
        user: { username },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        durationMinutes: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            imageUrl: true,
            publicEmail: true,
            timezone: true,
          },
        },
        schedule: {
          select: {
            id: true,
            name: true,
            timezone: true,
            slots: {
              select: {
                weekday: true,
                startMinutes: true,
                endMinutes: true,
              },
              orderBy: { weekday: "asc" },
            },
          },
        },
        questions: {
          select: {
            idx: true,
            question: true,
            type: true,
            required: true,
            options: true,
          },
          orderBy: { idx: "asc" },
        },
      },
    });

    return eventType;
  } catch (error) {
    console.error("Error fetching event type for booking:", error);
    return null;
  }
}

/**
 * Individual event type booking page.
 * Displays the event type details and booking form with date/time selection and questions.
 */
export default async function EventTypeBookingPage({ params }: Props) {
  const { user: username, eventTypeId: eventTypeSlug } = params;

  const eventTypeData = await getEventTypeForBooking(username, eventTypeSlug);

  if (!eventTypeData) {
    notFound();
  }

  // Generate availability data based on the schedule and event duration
  const hostTimezone = eventTypeData.user.timezone || "UTC";
  const availability = await generateAvailabilityData(
    eventTypeData.schedule,
    eventTypeData.durationMinutes,
    eventTypeData.id,
    hostTimezone
  );

  return (
    <BookingForm
      eventType={{
        id: eventTypeData.id,
        title: eventTypeData.title,
        slug: eventTypeData.slug,
        description: eventTypeData.description,
        durationMinutes: eventTypeData.durationMinutes,
        questions: eventTypeData.questions.map((q) => ({
          idx: q.idx,
          question: q.question,
          type: q.type as
            | "SHORT_TEXT"
            | "LONG_TEXT"
            | "RADIO"
            | "CHECKBOX"
            | "DROPDOWN"
            | "PHONE",
          required: q.required,
          options: q.options as string[] | null,
        })),
      }}
      user={{
        id: eventTypeData.user.id,
        name: eventTypeData.user.name,
        username: eventTypeData.user.username,
        imageUrl: eventTypeData.user.imageUrl,
        publicEmail: eventTypeData.user.publicEmail,
      }}
      initialAvailability={availability}
      hostTimezone={hostTimezone}
    />
  );
}
