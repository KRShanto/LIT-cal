"use client";

import { useRef } from "react";
import { ContactsTable } from "@/app/dashboard/contacts/contacts-table";
import type { Contact } from "@prisma/client";

export function ContactsTableContainer({
  items,
  search,
  onContactClick,
}: {
  items: Contact[];
  search: string;
  onContactClick?: (contact: Contact) => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative overflow-hidden rounded-md border border-white/10">
      <div
        ref={scrollRef}
        className="max-h-[70vh] overflow-x-auto overflow-y-auto sm:max-h-[75vh] lg:max-h-[80vh]"
      >
        <ContactsTable
          items={items}
          search={search}
          onContactClick={onContactClick}
        />
      </div>
    </div>
  );
}
