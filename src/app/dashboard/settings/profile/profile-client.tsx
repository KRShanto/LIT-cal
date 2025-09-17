"use client";

import ProfileDetailsForm from "./profile-details-form";
import PasswordForm from "./password-form";

export default function ProfileClient() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Profile settings
      </h1>
      <ProfileDetailsForm />
      <PasswordForm />
    </div>
  );
}
