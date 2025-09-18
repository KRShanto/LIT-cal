import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import BookingClient from "./booking-client";

type Props = {
  params: {
    user: string;
  };
};

/**
 * Fetches user data and their active event types for the booking page.
 * @param username - The username from the URL parameter
 * @returns User data with event types or null if not found
 */
async function getUserWithEventTypes(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        imageUrl: true,
        publicEmail: true,
        eventTypes: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            durationMinutes: true,
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
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user with event types:", error);
    return null;
  }
}

/**
 * Public booking page for a specific user.
 * Displays all active event types that can be booked.
 */
export default async function BookingPage({ params }: Props) {
  const { user: username } = params;

  const userData = await getUserWithEventTypes(username);

  if (!userData) {
    notFound();
  }

  return (
    <BookingClient
      user={userData}
      eventTypes={userData.eventTypes.map((et) => ({
        ...et,
        questions: et.questions.map((q) => ({
          ...q,
          options: q.options as string[] | null,
        })),
      }))}
    />
  );
}
