"use client";

import ProfileDetailsForm from "./profile-details-form";
import PasswordForm from "./password-form";
import type { DbUser } from "@/lib/auth";

export default function ProfileClient({ user }: { user: DbUser }) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Profile settings
      </h1>
      <ProfileDetailsForm
        initial={{
          name: user.name,
          username: user.username,
          publicEmail: user.publicEmail || "",
          timezone: user.timezone || "",
          imageUrl: user.imageUrl || null,
        }}
      />
      <PasswordForm />
    </div>
  );
}
