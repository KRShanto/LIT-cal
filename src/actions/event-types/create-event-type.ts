"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateEventTypeQuestionInput = {
  idx: number;
  question: string;
  type:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "RADIO"
    | "CHECKBOX"
    | "DROPDOWN"
    | "PHONE";
  required?: boolean;
  options?: unknown; // JSON-serializable; only for choice types
};

export type CreateEventTypeInput = {
  title: string;
  slug: string;
  description?: string;
  durationMinutes: number;
  scheduleId?: string | null;
  isActive?: boolean;
  questions?: CreateEventTypeQuestionInput[];
};

export type CreateEventTypeResult =
  | { ok: true; eventTypeId: string }
  | { ok: false; error: string };

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s.length ? s : undefined;
}

export async function createEventType(
  input: CreateEventTypeInput
): Promise<CreateEventTypeResult> {
  const user = await getDbUser();

  const title = cleanString(input.title);
  const slug = cleanString(input.slug);
  if (!title) return { ok: false, error: "Title is required" };
  if (!slug) return { ok: false, error: "Slug is required" };
  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes <= 0) {
    return {
      ok: false,
      error: "Duration must be a positive number of minutes",
    };
  }

  try {
    const exists = await prisma.eventType.findFirst({
      where: { userId: user.id, slug },
    });
    if (exists)
      return {
        ok: false,
        error: "Slug already exists. Choose a different one.",
      };

    const created = await prisma.$transaction(async (tx) => {
      const ev = await tx.eventType.create({
        data: {
          userId: user.id,
          title,
          slug,
          description: cleanString(input.description),
          durationMinutes: Math.floor(input.durationMinutes),
          scheduleId: input.scheduleId || null,
          isActive: Boolean(input.isActive ?? true),
        },
        select: { id: true },
      });

      if (input.questions && input.questions.length) {
        for (const q of input.questions) {
          await tx.eventTypeQuestion.create({
            data: {
              eventTypeId: ev.id,
              idx: q.idx,
              question: q.question,
              type: q.type,
              required: Boolean(q.required),
              options: q.options ?? undefined,
            },
          });
        }
      }

      return ev;
    });

    revalidatePath("/dashboard/scheduling");
    return { ok: true, eventTypeId: created.id };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      error: "Failed to create event type. Please try again.",
    };
  }
}
