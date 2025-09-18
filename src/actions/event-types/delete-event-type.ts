"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type DeleteEventTypeResult = { ok: true } | { ok: false; error: string };

export async function deleteEventType(
  id: string
): Promise<DeleteEventTypeResult> {
  const user = await getDbUser();
  if (!id) return { ok: false, error: "Missing id" };
  try {
    await prisma.$transaction(async (tx) => {
      const ev = await tx.eventType.findFirst({
        where: { id, userId: user.id },
        select: { id: true },
      });
      if (!ev) throw new Error("Not found");
      await tx.eventTypeQuestion.deleteMany({ where: { eventTypeId: id } });
      await tx.eventType.delete({ where: { id } });
    });
    revalidatePath("/dashboard/scheduling");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to delete event type" };
  }
}
