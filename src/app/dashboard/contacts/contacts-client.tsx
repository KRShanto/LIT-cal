"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateContactDrawer } from "@/app/dashboard/contacts/create-contact-drawer";
import { ContactsHeader } from "@/app/dashboard/contacts/contacts-header";
import { ContactsTableContainer } from "@/app/dashboard/contacts/contacts-table-container";
import { ContactsPaginationController } from "@/app/dashboard/contacts/contacts-pagination-controller";

type ContactItem = {
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

export default function ContactsClient({
  initialContacts,
  total,
  page,
  pageSize,
  search,
  maxPerPage,
}: {
  initialContacts: ContactItem[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  maxPerPage: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const contacts = useMemo(() => initialContacts, [initialContacts]);

  const onOpenDrawer = () => setIsDrawerOpen(true);

  return (
    <div className="flex h-full flex-col gap-4">
      <ContactsHeader defaultQuery={search} onOpenCreate={onOpenDrawer} />

      <ContactsTableContainer items={contacts} search={search} />

      {total > maxPerPage && (
        <ContactsPaginationController
          page={page}
          total={total}
          pageSize={pageSize}
        />
      )}

      <CreateContactDrawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          startTransition(() => router.refresh());
        }}
      />
    </div>
  );
}
