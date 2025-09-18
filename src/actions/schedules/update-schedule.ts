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

export type UpdateScheduleInput = {
  id: string;
  name: string;
  timezone: string;
  isDefault?: boolean;
  slots: Array<{ weekday: Weekday; startMinutes: number; endMinutes: number }>;
};

export type UpdateScheduleResult = { ok: true } | { ok: false; error: string };

function cleanStr(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length ? v : undefined;
}

export async function updateSchedule(
  input: UpdateScheduleInput
): Promise<UpdateScheduleResult> {
  const user = await getDbUser();

  const name = cleanStr(input.name);
  const timezone = cleanStr(input.timezone);
  if (!input.id) return { ok: false, error: "Missing schedule id." };
  if (!name) return { ok: false, error: "Schedule name is required." };
  if (!timezone) return { ok: false, error: "Timezone is required." };
  if (!Array.isArray(input.slots))
    return { ok: false, error: "Invalid slots." };

  try {
    await prisma.$transaction(async (tx) => {
      // Ensure schedule belongs to user
      const sched = await tx.schedule.findFirst({
        where: { id: input.id, userId: user.id },
        select: { id: true },
      });
      if (!sched) throw new Error("Not found");

      if (input.isDefault) {
        await tx.schedule.updateMany({
          where: { userId: user.id, isDefault: true, NOT: { id: input.id } },
          data: { isDefault: false },
        });
      }

      await tx.schedule.update({
        where: { id: input.id },
        data: {
          name,
          timezone,
          isDefault: Boolean(input.isDefault),
        },
      });

      // Replace slots (simplest for MVP)
      await tx.availabilitySlot.deleteMany({ where: { scheduleId: input.id } });
      if (input.slots.length > 0) {
        await tx.availabilitySlot.createMany({
          data: input.slots.map((s) => ({
            scheduleId: input.id,
            weekday: s.weekday,
            startMinutes: s.startMinutes,
            endMinutes: s.endMinutes,
          })),
        });
      }
    });

    revalidatePath("/dashboard/availability");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to update schedule. Please try again." };
  }
}
