"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type CreateContactInput = {
  fullName: string;
  email?: string;
  phone?: string;
  phoneCountry?: string;
  jobTitle?: string;
  company?: string;
  linkedin?: string;
  timezone?: string;
  country?: string;
  city?: string;
  state?: string;
  avatarUrl?: string;
  notes?: string;
};

type CreateContactResult =
  | { ok: true; contactId: string }
  | { ok: false; error: string };

function clean(value: string | undefined | null): string | undefined {
  const v = (value ?? "").trim();
  return v.length ? v : undefined;
}

/**
 * Creates a new Contact for the current user.
 *
 * Expected form fields (all strings):
 * - fullName (required)
 * - email, phone, phoneCountry, jobTitle, company, linkedin,
 *   timezone, country, city, state, avatarUrl, notes (optional)
 *
 * On success, revalidates `/dashboard/contacts` so the list updates.
 */
export async function createContact(
  input: CreateContactInput
): Promise<CreateContactResult> {
  const user = await getDbUser();

  const fullName = clean(input.fullName);
  if (!fullName) {
    return { ok: false, error: "Full name is required." };
  }

  try {
    const created = await prisma.contact.create({
      data: {
        userId: user.id,
        fullName,
        email: clean(input.email),
        phone: clean(input.phone),
        phoneCountry: clean(input.phoneCountry),
        jobTitle: clean(input.jobTitle),
        company: clean(input.company),
        linkedin: clean(input.linkedin),
        timezone: clean(input.timezone),
        country: clean(input.country),
        city: clean(input.city),
        state: clean(input.state),
        avatarUrl: clean(input.avatarUrl),
        notes: clean(input.notes),
      },
      select: { id: true },
    });

    // Revalidate the contacts dashboard page
    revalidatePath("/dashboard/contacts");

    return { ok: true, contactId: created.id };
  } catch {
    return { ok: false, error: "Failed to create contact. Please try again." };
  }
}
