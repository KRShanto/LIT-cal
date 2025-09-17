"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section className="rounded-lg border border-white/10 bg-neutral-950/50 p-6">
      <h2 className="text-xl font-semibold">Change password</h2>
      <p className="mt-1 text-base text-slate-400">
        Enter your current password to set a new one.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="relative md:col-span-2">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6">
        <button className="rounded-md bg-primary px-5 py-2.5 text-base font-medium text-neutral-950">
          Update password
        </button>
      </div>
    </section>
  );
}
