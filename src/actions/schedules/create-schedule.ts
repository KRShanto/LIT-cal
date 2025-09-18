"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type CreateScheduleInput = {
  name: string;
  timezone: string;
  isDefault?: boolean;
  slots: Array<{ weekday: Weekday; startMinutes: number; endMinutes: number }>;
};

export type CreateScheduleResult =
  | { ok: true; scheduleId: string }
  | { ok: false; error: string };

function cleanStr(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length ? v : undefined;
}

export async function createSchedule(
  input: CreateScheduleInput
): Promise<CreateScheduleResult> {
  const user = await getDbUser();

  const name = cleanStr(input.name);
  const timezone = cleanStr(input.timezone);
  if (!name) return { ok: false, error: "Schedule name is required." };
  if (!timezone) return { ok: false, error: "Timezone is required." };
  if (!Array.isArray(input.slots) || input.slots.length === 0)
    return {
      ok: false,
      error: "Please provide at least one availability slot.",
    };

  // Basic validation for slots
  for (const s of input.slots) {
    if (
      !s ||
      typeof s.startMinutes !== "number" ||
      typeof s.endMinutes !== "number"
    )
      return { ok: false, error: "Invalid slot provided." };
    if (s.startMinutes >= s.endMinutes)
      return { ok: false, error: "Slot start must be before end." };
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      // If marking default, unset existing defaults for this user
      if (input.isDefault) {
        await tx.schedule.updateMany({
          where: { userId: user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const schedule = await tx.schedule.create({
        data: {
          userId: user.id,
          name,
          isDefault: Boolean(input.isDefault),
          timezone,
          slots: {
            create: input.slots.map((s) => ({
              weekday: s.weekday,
              startMinutes: s.startMinutes,
              endMinutes: s.endMinutes,
            })),
          },
        },
        select: { id: true },
      });

      return schedule;
    });

    revalidatePath("/dashboard/availability");
    return { ok: true, scheduleId: created.id };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to create schedule. Please try again." };
  }
}
