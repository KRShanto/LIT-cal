"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function changePassword(input: ChangePasswordInput) {
  const user = await requireAuth();

  const currentPassword = input.currentPassword || "";
  const newPassword = input.newPassword || "";
  const confirmPassword = input.confirmPassword || "";

  const passwordLength =
    (process.env.MIN_PASSWORD_LEN as number | undefined) || 6;

  if (newPassword.length < passwordLength) {
    return {
      ok: false,
      field: "newPassword",
      error: `Password must be at least ${passwordLength} characters`,
    } as const;
  }
  if (newPassword !== confirmPassword) {
    return {
      ok: false,
      field: "confirmPassword",
      error: "Passwords do not match",
    } as const;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!dbUser?.passwordHash) {
    return {
      ok: false,
      field: "currentPassword",
      error: "Password not set for this account",
    } as const;
  }

  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) {
    return {
      ok: false,
      field: "currentPassword",
      error: "Current password is incorrect",
    } as const;
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hash },
  });

  return { ok: true } as const;
}
