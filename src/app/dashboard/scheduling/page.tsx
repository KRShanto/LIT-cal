import React from "react";
import SchedulingClient from "@/app/dashboard/scheduling/scheduling-client";
import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";

export default async function Page() {
  const user = await getDbUser();
  const [schedules, eventTypes] = await Promise.all([
    prisma.schedule.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, isDefault: true },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
    prisma.eventType.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        durationMinutes: true,
        scheduleId: true,
        isActive: true,
        isPublic: true,
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
    }),
  ]);

  return (
    <SchedulingClient
      schedules={
        schedules as { id: string; name: string; isDefault: boolean }[]
      }
      eventTypes={
        eventTypes as {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          durationMinutes: number;
          scheduleId: string | null;
          isActive: boolean;
          isPublic: boolean;
          questions: {
            idx: number;
            question: string;
            type:
              | "SHORT_TEXT"
              | "LONG_TEXT"
              | "RADIO"
              | "CHECKBOX"
              | "DROPDOWN"
              | "PHONE";
            required: boolean;
            options: string[] | null;
          }[];
        }[]
      }
    />
  );
}
