"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

type UpdateProfileInput = {
  name: string;
  username: string;
  publicEmail?: string;
  timezone?: string;
  imageUrl?: string | null;
};

export async function updateProfile(input: UpdateProfileInput) {
  const user = await requireAuth();

  const name = (input.name || "").trim();
  const username = (input.username || "").trim();
  const publicEmail = input.publicEmail?.trim() || null;
  const timezone = input.timezone?.trim() || null;
  const imageUrl = input.imageUrl ?? null;

  if (!name) {
    return { ok: false, field: "name", error: "Name is required" } as const;
  }
  if (!username) {
    return {
      ok: false,
      field: "username",
      error: "Username is required",
    } as const;
  }

  // Check username uniqueness (excluding current user)
  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: user.id } },
    select: { id: true },
  });
  if (existing) {
    return {
      ok: false,
      field: "username",
      error: "Username already taken",
    } as const;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name, username, publicEmail, timezone, imageUrl },
  });

  return { ok: true } as const;
}
