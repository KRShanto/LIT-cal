"use client";

import { useRef, useState, useMemo } from "react";
import { Camera, User, AtSign, Mail, Lock, Globe } from "lucide-react";
import TimezonePicker from "@/components/timezone-picker";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // timezone options handled inside TimezonePicker

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Profile settings
      </h1>

      {/* Profile details */}
      <section className="rounded-lg border border-white/10 bg-neutral-950/50 p-6">
        <h2 className="text-xl font-semibold">Your profile</h2>
        <p className="mt-1 text-base text-slate-400">
          Update your personal information. Changes are not saved in this demo.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-base">Avatar</label>
            <div className="mt-3 flex items-center gap-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-neutral-900 outline-none ring-0 transition hover:border-primary/50 focus:ring-2 focus:ring-primary"
                aria-label="Change avatar"
                style={{ cursor: "pointer" }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                    <Camera className="h-7 w-7" />
                  </div>
                )}
              </button>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setAvatarUrl(url);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-white/10 bg-primary/10 px-4 py-2 text-base text-primary hover:bg-primary/15"
                  style={{ cursor: "pointer" }}
                >
                  Choose image
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Public email"
              value={publicEmail}
              onChange={(e) => setPublicEmail(e.target.value)}
              className="w-full h-12 rounded-md border border-white/10 bg-neutral-950 pl-10 pr-3 text-lg text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <TimezonePicker value={timezone} onChange={setTimezone} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="rounded-md bg-primary px-5 py-2.5 text-base font-medium text-neutral-950">
            Save changes
          </button>
          <button className="rounded-md border border-white/10 px-5 py-2.5 text-base text-slate-200 hover:bg-white/5">
            Cancel
          </button>
        </div>
      </section>

      {/* Change password */}
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
    </div>
  );
}
