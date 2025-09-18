"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type DeleteScheduleResult = { ok: true } | { ok: false; error: string };

export async function deleteSchedule(
  id: string
): Promise<DeleteScheduleResult> {
  const user = await getDbUser();
  if (!id || typeof id !== "string") {
    return { ok: false, error: "Invalid schedule id." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Ensure the schedule belongs to the user
      const existing = await tx.schedule.findFirst({
        where: { id, userId: user.id },
        select: { id: true },
      });
      if (!existing) throw new Error("Not found");

      // Delete child slots first, then the schedule
      await tx.availabilitySlot.deleteMany({ where: { scheduleId: id } });
      await tx.schedule.delete({ where: { id } });
    });

    revalidatePath("/dashboard/availability");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to delete schedule. Please try again." };
  }
}
