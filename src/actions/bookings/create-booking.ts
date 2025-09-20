"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateBookingInput = {
  eventTypeId: string;
  inviteeName: string;
  inviteeEmail: string;
  inviteePhone?: string;
  startAt: Date;
  endAt: Date;
  timezone: string;
  answers?: Record<string, string>;
};

export type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

/**
 * Creates a new booking for an event type.
 * @param input - The booking data
 * @returns Result with booking ID or error message
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  try {
    // Validate required fields
    if (!input.eventTypeId || !input.inviteeName || !input.inviteeEmail) {
      return { ok: false, error: "Missing required fields" };
    }

    if (!input.startAt || !input.endAt) {
      return { ok: false, error: "Start and end times are required" };
    }

    // Check if event type exists and is active
    const eventType = await prisma.eventType.findUnique({
      where: { id: input.eventTypeId },
      select: { id: true, userId: true, isActive: true, durationMinutes: true },
    });

    if (!eventType) {
      return { ok: false, error: "Event type not found" };
    }

    if (!eventType.isActive) {
      return { ok: false, error: "Event type is not available" };
    }

    // Check for overlapping bookings
    // Only check for confirmed or pending bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        userId: eventType.userId,
        startAt: { lt: input.endAt },
        endAt: { gt: input.startAt },
      },
    });

    if (overlappingBooking) {
      return { ok: false, error: "Time slot is not available" };
    }

    // Use transaction to create both contact and booking atomically
    const result = await prisma.$transaction(async (tx) => {
      // Check if contact already exists for this user and email
      let contact = await tx.contact.findFirst({
        where: {
          userId: eventType.userId,
          email: input.inviteeEmail,
        },
      });

      // Create contact if it doesn't exist
      if (!contact) {
        contact = await tx.contact.create({
          data: {
            userId: eventType.userId,
            fullName: input.inviteeName,
            email: input.inviteeEmail,
            phone: input.inviteePhone,
            timezone: input.timezone,
          },
        });
      }

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          eventTypeId: input.eventTypeId,
          userId: eventType.userId,
          contactId: contact.id,
          inviteeName: input.inviteeName,
          inviteeEmail: input.inviteeEmail,
          inviteePhone: input.inviteePhone,
          startAt: input.startAt,
          endAt: input.endAt,
          timezone: input.timezone,
          metadata: input.answers ? JSON.stringify(input.answers) : undefined,
        },
        select: { id: true },
      });

      return { booking, contact };
    });

    // TODO: Create invitee answers if questions were answered
    // This would require creating InviteeAnswer records

    revalidatePath("/dashboard/meetings");
    revalidatePath("/dashboard/contacts");
    return { ok: true, bookingId: result.booking.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      ok: false,
      error: "Failed to create booking. Please try again.",
    };
  }
}
