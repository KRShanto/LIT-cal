"use client";

import React from "react";

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full ${maxWidth} transform bg-neutral-950 shadow-xl ring-1 ring-white/10 transition-transform duration-350 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 px-2 py-1 text-slate-200 hover:bg-white/5"
          >
            Close
          </button>
        </div>
        <div className="h-[calc(100%-49px)] overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
