"use client";

import { useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import TimezonePicker from "@/components/timezone-picker";
import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "@/lib/uploadthing";
import { createContact } from "@/actions/contacts/create-contact";
import Drawer from "@/components/ui/drawer";

export function CreateContactDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [timezoneValue, setTimezoneValue] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { uploadFiles } = genUploader<OurFileRouter>();
  const [, startTransition] = useTransition();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      let finalAvatarUrl: string | null = avatarUrl;
      if (avatarFile) {
        const res = await uploadFiles("imageUploader", { files: [avatarFile] });
        finalAvatarUrl = res?.[0]?.ufsUrl ?? finalAvatarUrl;
      }
      const res = await createContact({
        fullName,
        email,
        phone,
        phoneCountry,
        company,
        jobTitle,
        timezone: timezoneValue,
        linkedin,
        country,
        city,
        state,
        avatarUrl: finalAvatarUrl ?? undefined,
        notes,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      startTransition(() => {
        // Let parent refresh
        onClose();
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      title="New contact"
      maxWidth="max-w-md"
    >
      <form onSubmit={submit} className="flex h-full flex-col">
        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400">Avatar</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-neutral-900 outline-none ring-0 transition hover:border-primary/50 focus:ring-2 focus:ring-primary"
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
                    <Camera className="h-5 w-5" />
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
                      setAvatarUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      return;
                    }
                    const url = URL.createObjectURL(file);
                    setAvatarUrl(url);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-md border border-white/10 bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/15"
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
                    className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/5"
                    aria-label="Remove profile picture"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Full name *</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
              placeholder="Full name"
              name="fullName"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Email address"
                name="email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Phone number"
                name="phone"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Phone country</label>
              <input
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Country code"
                name="phoneCountry"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="LinkedIn profile URL"
                name="linkedin"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Company"
                name="company"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Job title</label>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Job title"
                name="jobTitle"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Timezone</label>
            <TimezonePicker
              size="sm"
              background="input"
              value={timezoneValue}
              onChange={setTimezoneValue}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Country</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="Country"
                name="country"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="City"
                name="city"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">State</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
                placeholder="State/Region"
                name="state"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none"
              placeholder="Notes"
              name="notes"
            />
          </div>
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
        <div className="mt-auto flex items-center justify-end gap-2 pt-6">
          <button
            type="button"
            className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md border border-primary/60 bg-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/30 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create contact"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
