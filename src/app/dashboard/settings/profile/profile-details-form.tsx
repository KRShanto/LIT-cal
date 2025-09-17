"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, User, AtSign, Mail, Loader2 } from "lucide-react";
import TimezonePicker from "@/components/timezone-picker";
import { updateProfile } from "@/actions/user/update-profile";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/lib/uploadthing";

export default function ProfileDetailsForm({
  initial,
}: {
  initial: {
    name: string;
    username: string;
    publicEmail: string;
    timezone: string;
    imageUrl: string | null;
  };
}) {
  const [name, setName] = useState(initial.name || "");
  const [username, setUsername] = useState(initial.username || "");
  const [publicEmail, setPublicEmail] = useState(initial.publicEmail || "");
  const [timezone, setTimezone] = useState(initial.timezone || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initial.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { uploadFiles } = genUploader<OurFileRouter>();

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        let imageUrl = avatarUrl;
        if (avatarFile) {
          const res = await uploadFiles("imageUploader", {
            files: [avatarFile],
          });
          imageUrl = res?.[0]?.ufsUrl ?? imageUrl;
        }
        const result = await updateProfile({
          name,
          username,
          publicEmail,
          timezone,
          imageUrl,
        });
        if (!result.ok) setSubmitError(result.error || "Failed to save");
      } catch (err: unknown) {
        setSubmitError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  };

  return (
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
                  const file = e.target.files?.[0] || null;
                  setAvatarFile(file);
                  if (!file) {
                    setAvatarUrl(initial.imageUrl || null);
                    return;
                  }
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
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setAvatarUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                    setAvatarFile(null);
                  }}
                  className="rounded-md border border-white/10 px-4 py-2 text-base text-slate-200 hover:bg-white/5"
                  aria-label="Remove profile picture"
                >
                  Remove
                </button>
              )}
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
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-base font-medium text-neutral-950 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Saving..." : "Save changes"}
        </button>

        {submitError && <p className="text-red-300 text-base">{submitError}</p>}
      </div>
    </section>
  );
}
