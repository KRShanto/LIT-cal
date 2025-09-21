"use client";

import {
  Calendar,
  Plus,
  Link as LinkIcon,
  Settings,
  Activity,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type QuickActionsProps = {
  bookingUrl: string;
};

/**
 * Client-side Quick Actions component with copy to clipboard functionality
 */
export default function QuickActions({ bookingUrl }: QuickActionsProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copies booking URL to clipboard with user feedback
   */
  const copyBookingUrl = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = bookingUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Quick Actions
      </h2>
      <div className="space-y-3">
        <Link
          href="/dashboard/scheduling"
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm hover:bg-white/10 transition-colors group"
        >
          <div className="rounded-md bg-primary/20 p-2 group-hover:bg-primary/30 transition-colors">
            <Plus className="h-4 w-4 text-primary" />
          </div>
          <span className="text-white">Create event type</span>
        </Link>

        <button
          onClick={copyBookingUrl}
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm hover:bg-white/10 transition-colors group w-full text-left"
        >
          <div className="rounded-md bg-blue-500/20 p-2 group-hover:bg-blue-500/30 transition-colors">
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <LinkIcon className="h-4 w-4 text-blue-400" />
            )}
          </div>
          <span className="text-white">
            {copied ? "Copied!" : "Copy booking link"}
          </span>
        </button>

        <Link
          href="/dashboard/availability"
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm hover:bg-white/10 transition-colors group"
        >
          <div className="rounded-md bg-green-500/20 p-2 group-hover:bg-green-500/30 transition-colors">
            <Calendar className="h-4 w-4 text-green-400" />
          </div>
          <span className="text-white">Update availability</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm hover:bg-white/10 transition-colors group"
        >
          <div className="rounded-md bg-orange-500/20 p-2 group-hover:bg-orange-500/30 transition-colors">
            <Settings className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-white">Settings</span>
        </Link>
      </div>
    </div>
  );
}
