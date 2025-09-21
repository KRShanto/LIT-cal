"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateContactDrawer } from "@/app/dashboard/contacts/create-contact-drawer";
import { EditContactDrawer } from "@/app/dashboard/contacts/edit-contact-drawer";
import { ContactsHeader } from "@/app/dashboard/contacts/contacts-header";
import { ContactsTableContainer } from "@/app/dashboard/contacts/contacts-table-container";
import { ContactsPaginationController } from "@/app/dashboard/contacts/contacts-pagination-controller";
import type { Contact } from "@prisma/client";

export default function ContactsClient({
  initialContacts,
  total,
  page,
  pageSize,
  search,
  maxPerPage,
}: {
  initialContacts: Contact[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  maxPerPage: number;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const contacts = useMemo(() => initialContacts, [initialContacts]);

  const onOpenCreateDrawer = () => setIsCreateDrawerOpen(true);

  const onContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const onCloseEditDrawer = () => {
    setSelectedContact(null);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <ContactsHeader defaultQuery={search} onOpenCreate={onOpenCreateDrawer} />

      <ContactsTableContainer
        items={contacts}
        search={search}
        onContactClick={onContactClick}
      />

      {total > maxPerPage && (
        <ContactsPaginationController
          page={page}
          total={total}
          pageSize={pageSize}
        />
      )}

      <CreateContactDrawer
        open={isCreateDrawerOpen}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          startTransition(() => router.refresh());
        }}
      />

      <EditContactDrawer
        contact={selectedContact}
        open={selectedContact !== null}
        onClose={onCloseEditDrawer}
      />
    </div>
  );
}
