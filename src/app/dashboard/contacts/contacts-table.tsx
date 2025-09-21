"use client";

import { useMemo } from "react";

export type ContactItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  timezone: string | null;
  avatarUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function ContactsTable({
  items,
  search,
  onContactClick,
}: {
  items: ContactItem[];
  search: string;
  onContactClick?: (contact: ContactItem) => void;
}) {
  const contacts = useMemo(() => {
    return items.map((c) => ({
      ...c,
      createdAt:
        typeof c.createdAt === "string" ? c.createdAt : c.createdAt.toString(),
      updatedAt:
        typeof c.updatedAt === "string" ? c.updatedAt : c.updatedAt.toString(),
    }));
  }, [items]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  return (
    <table className="min-w-full border-collapse text-base">
      <thead className="sticky top-0 z-10 bg-neutral-900 text-left text-slate-200">
        <tr>
          <th className="px-3 py-2 font-medium">Name</th>
          <th className="hidden px-3 py-2 font-medium md:table-cell">Email</th>
          <th className="hidden px-3 py-2 font-medium md:table-cell">
            Company
          </th>
          <th className="hidden px-3 py-2 font-medium lg:table-cell">Phone</th>
        </tr>
      </thead>
      <tbody>
        {contacts.length === 0 ? (
          <tr>
            <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
              {search ? "No contacts match your search." : "No contacts yet."}
            </td>
          </tr>
        ) : (
          contacts.map((c, index) => (
            <tr
              key={index}
              className="border-t border-white/10 text-slate-200 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => onContactClick?.(c)}
            >
              <td className="px-3 py-2">
                <div className="flex items-center gap-3">
                  {c.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.avatarUrl}
                      alt={c.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                      {getInitials(c.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{c.fullName}</div>
                    <div className="truncate text-xs text-slate-400 md:hidden">
                      {c.email || "—"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden truncate px-3 py-2 md:table-cell">
                {c.email || "—"}
              </td>
              <td className="hidden truncate px-3 py-2 md:table-cell">
                {c.company || "—"}
              </td>
              <td className="hidden truncate px-3 py-2 lg:table-cell">
                {c.phone || "—"}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
