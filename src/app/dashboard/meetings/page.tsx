import React from "react";
import { prisma } from "@/lib/db";
import MeetingsClient from "./meetings-client";
import { getDbUser } from "@/lib/auth";

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

/**
 * Fetches all bookings for the current user.
 * @returns Array of bookings with event type and contact information
 */
async function getUserBookings(): Promise<Booking[]> {
  try {
    const user = await getDbUser();
    if (!user) {
      throw new Error("User not found");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        inviteeName: true,
        inviteeEmail: true,
        inviteePhone: true,
        startAt: true,
        endAt: true,
        timezone: true,
        eventType: {
          select: {
            id: true,
            title: true,
            slug: true,
            durationMinutes: true,
          },
        },
        contact: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        answers: {
          select: {
            id: true,
            question: {
              select: {
                idx: true,
                question: true,
                type: true,
              },
            },
            value: true,
          },
        },
      },
      orderBy: {
        startAt: "desc",
      },
    });

    return bookings.map((booking) => ({
      ...booking,
      answers: booking.answers.map((answer) => ({
        ...answer,
        value: answer.value as string | string[] | number | boolean,
      })),
    }));
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}

/**
 * Meetings page displaying all user bookings.
 * Shows upcoming and past meetings with filtering and search capabilities.
 */
export default async function MeetingsPage() {
  const user = await getDbUser();
  const bookings = await getUserBookings();

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <MeetingsClient bookings={bookings} userTimezone={user.timezone || "UTC"} />
  );
}
