"use client";

import { useRef } from "react";
import {
  ContactsTable,
  type ContactItem,
} from "@/app/dashboard/contacts/contacts-table";

export function ContactsTableContainer({
  items,
  search,
}: {
  items: ContactItem[];
  search: string;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="relative overflow-hidden rounded-md border border-white/10">
      <div
        ref={scrollRef}
        className="max-h-[70vh] overflow-x-auto overflow-y-auto sm:max-h-[75vh] lg:max-h-[80vh]"
      >
        <ContactsTable items={items} search={search} />
      </div>
    </div>
  );
}
