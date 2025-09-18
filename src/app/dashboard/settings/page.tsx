import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-white/60 mt-1">
          Manage your profile and calendar connections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Profile settings link */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Profile</h2>
          <p className="text-sm text-white/60 mt-1">
            Update your name, avatar, public email, and more.
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard/settings/profile"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Open profile settings
            </Link>
          </div>
        </div>

        {/* Google Calendar connect */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-5">
          <h2 className="font-medium">Calendar</h2>
          <p className="text-sm text-white/60 mt-1">
            Connect your Google Calendar to create and manage events.
          </p>
          <div className="mt-4">
            {/* This endpoint should start Google OAuth. Implement the API route separately. */}
            <a
              href="/api/integrations/google/connect"
              className="inline-flex items-center rounded-md border border-white/15 px-3 py-2 text-sm font-medium hover:bg-white/5"
            >
              Connect Google Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
