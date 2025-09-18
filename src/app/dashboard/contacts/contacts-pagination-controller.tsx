"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ContactsPagination } from "@/app/dashboard/contacts/contacts-pagination";

export function ContactsPaginationController({
  page,
  total,
  pageSize,
}: {
  page: number;
  total: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (nextPage: number) => {
    const totalPages = Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1);
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", String(clamped));
    const url = `${pathname}?${params.toString()}`;
    startTransition(() => router.push(url));
  };

  return (
    <ContactsPagination
      page={page}
      total={total}
      pageSize={pageSize}
      disabled={isPending}
      onPage={goToPage}
    />
  );
}
