"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "RADIO"
  | "CHECKBOX"
  | "DROPDOWN"
  | "PHONE";

export type UpdateEventTypeInput = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  durationMinutes: number;
  scheduleId?: string | null;
  isActive?: boolean;
  questions?: {
    idx: number;
    question: string;
    type: QuestionType;
    required?: boolean;
    options?: unknown;
  }[];
};

export type UpdateEventTypeResult = { ok: true } | { ok: false; error: string };

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
}

export async function updateEventType(
  input: UpdateEventTypeInput
): Promise<UpdateEventTypeResult> {
  const user = await getDbUser();
  if (!input.id) return { ok: false, error: "Missing id" };
  const title = cleanString(input.title);
  const slug = cleanString(input.slug);
  if (!title || !slug)
    return { ok: false, error: "Title and slug are required" };
  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    return { ok: false, error: "Duration must be positive" };
  }
  try {
    await prisma.$transaction(async (tx) => {
      // Ownership and slug uniqueness (within user, excluding this id)
      const existing = await tx.eventType.findFirst({
        where: { id: input.id, userId: user.id },
        select: { id: true },
      });
      if (!existing) throw new Error("Not found");
      const other = await tx.eventType.findFirst({
        where: { userId: user.id, slug, NOT: { id: input.id } },
        select: { id: true },
      });
      if (other) throw new Error("Slug already exists");

      await tx.eventType.update({
        where: { id: input.id },
        data: {
          title,
          slug,
          description: cleanString(input.description),
          durationMinutes: Math.floor(input.durationMinutes),
          scheduleId: input.scheduleId || null,
          isActive: Boolean(input.isActive ?? true),
        },
      });

      // Replace questions for simplicity
      await tx.eventTypeQuestion.deleteMany({
        where: { eventTypeId: input.id },
      });
      if (input.questions && input.questions.length) {
        for (const q of input.questions) {
          await tx.eventTypeQuestion.create({
            data: {
              eventTypeId: input.id,
              idx: q.idx,
              question: q.question,
              type: q.type,
              required: Boolean(q.required),
              options: q.options ?? undefined,
            },
          });
        }
      }
    });

    revalidatePath("/dashboard/scheduling");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to update event type" };
  }
}
