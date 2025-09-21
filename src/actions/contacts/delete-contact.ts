"use server";

import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type DeleteContactResult = { ok: true } | { ok: false; error: string };

/**
 * Deletes a contact for the current user.
 * Ensures the contact belongs to the current user before deletion.
 */
export async function deleteContact(
  contactId: string
): Promise<DeleteContactResult> {
  const user = await getDbUser();

  if (!contactId?.trim()) {
    return { ok: false, error: "Contact ID is required." };
  }

  try {
    // First verify the contact belongs to the current user
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!existingContact) {
      return { ok: false, error: "Contact not found or access denied." };
    }

    // Delete the contact
    await prisma.contact.delete({
      where: { id: contactId },
    });

    // Revalidate the contacts dashboard page
    revalidatePath("/dashboard/contacts");

    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete contact. Please try again." };
  }
}
