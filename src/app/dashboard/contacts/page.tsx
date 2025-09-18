import { prisma } from "@/lib/db";
import { getDbUser } from "@/lib/auth";
import ContactsClient from "@/app/dashboard/contacts/contacts-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string;
  page?: string;
  pageSize?: string;
  vh?: string;
};

const MAX_CONTACTS = 15;

export const metadata: Metadata = {
  title: "Contacts",
};

// TODO: make this page responsive
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await getDbUser();

  const params = await searchParams;
  const search = (params.search || "").trim();
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);
  const requestedPageSize =
    parseInt(params.pageSize || String(MAX_CONTACTS), 10) || MAX_CONTACTS;
  const pageSize = Math.min(Math.max(requestedPageSize, 1), MAX_CONTACTS);
  const skip = (page - 1) * pageSize;

  const where = {
    userId: user.id,
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [total, contacts] = await Promise.all([
    prisma.contact.count({ where }),
    prisma.contact.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        jobTitle: true,
        timezone: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return (
    <ContactsClient
      initialContacts={contacts}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      maxPerPage={MAX_CONTACTS}
    />
  );
}
