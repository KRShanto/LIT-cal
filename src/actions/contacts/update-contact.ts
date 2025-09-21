"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type UpdateContactInput = {
  id: string;
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

type UpdateContactResult =
  | { ok: true; contactId: string }
  | { ok: false; error: string };

function clean(value: string | undefined | null): string | undefined {
  const v = (value ?? "").trim();
  return v.length ? v : undefined;
}

/**
 * Updates an existing Contact for the current user.
 *
 * Expected form fields (all strings):
 * - id (required) - The contact ID to update
 * - fullName (required)
 * - email, phone, phoneCountry, jobTitle, company, linkedin,
 *   timezone, country, city, state, avatarUrl, notes (optional)
 *
 * On success, revalidates `/dashboard/contacts` so the list updates.
 */
export async function updateContact(
  input: UpdateContactInput
): Promise<UpdateContactResult> {
  const user = await getDbUser();

  const fullName = clean(input.fullName);
  if (!fullName) {
    return { ok: false, error: "Full name is required." };
  }

  if (!input.id?.trim()) {
    return { ok: false, error: "Contact ID is required." };
  }

  try {
    // First verify the contact belongs to the current user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: input.id,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existingContact) {
      return { ok: false, error: "Contact not found or access denied." };
    }

    // Update the contact
    const updated = await prisma.contact.update({
      where: { id: input.id },
      data: {
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

    return { ok: true, contactId: updated.id };
  } catch {
    return { ok: false, error: "Failed to update contact. Please try again." };
  }
}
