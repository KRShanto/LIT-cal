"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DeleteContactModal({
  open,
  contactName,
  onClose,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  contactName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  const [isMounted, setIsMounted] = useState(open);
  const [isOpen, setIsOpen] = useState(open);

  // sync external open prop
  if (open && !isMounted) {
    setIsMounted(true);
    requestAnimationFrame(() => setIsOpen(true));
  }
  if (!open && isOpen) {
    setIsOpen(false);
    setTimeout(() => setIsMounted(false), 200);
  }

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 transition-opacity ${
          isOpen ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"
        }`}
        onClick={!isDeleting ? onClose : undefined}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-md transform rounded-lg bg-neutral-950 shadow-xl ring-1 ring-white/10 transition-all duration-200 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Delete contact
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-slate-200">
                    {contactName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="rounded-md border border-red-500/60 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete contact"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
