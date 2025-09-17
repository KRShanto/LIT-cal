"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localQuery, setLocalQuery] = useState(search || "");

  const totalPages = Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1);
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  const contacts = useMemo(() => {
    // Ensure dates are displayed consistently
    return initialContacts.map((c) => ({
      ...c,
      createdAt:
        typeof c.createdAt === "string" ? c.createdAt : c.createdAt.toString(),
      updatedAt:
        typeof c.updatedAt === "string" ? c.updatedAt : c.updatedAt.toString(),
    }));
  }, [initialContacts]);

  const setQueryParams = (
    updates: Record<string, string | number | undefined>
  ) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    const url = `${pathname}?${params.toString()}`;
    startTransition(() => router.push(url));
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryParams({ search: localQuery.trim() || undefined, page: 1 });
  };

  const goToPage = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setQueryParams({ page: clamped });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const windowSize = 1; // pages around current
    const add = (p: number | string) => pages.push(p);

    add(1);
    const start = Math.max(2, page - windowSize);
    const end = Math.min(totalPages - 1, page + windowSize);
    if (start > 2) add("…");
    for (let p = start; p <= end; p++) add(p);
    if (end < totalPages - 1) add("…");
    if (totalPages > 1) add(totalPages);
    return pages;
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Contacts
        </h1>
        <form onSubmit={onSubmitSearch} className="flex w-full gap-2 sm:w-auto">
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search name, email, company..."
            className="flex-1 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-0 sm:w-80"
            aria-label="Search contacts"
          />
          <button
            type="submit"
            className="rounded-md border border-primary/60 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            disabled={isPending}
          >
            Search
          </button>
        </form>
      </div>

      {/* Scroll container with responsive max-height to avoid large empty gap */}
      <div className="relative overflow-hidden rounded-md border border-white/10">
        <div
          ref={scrollRef}
          className="max-h-[70vh] overflow-x-auto overflow-y-auto sm:max-h-[75vh] lg:max-h-[80vh]"
        >
          <table className="min-w-full border-collapse text-base">
            <thead className="sticky top-0 z-10 bg-neutral-900 text-left text-slate-200">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">
                  Email
                </th>
                <th className="hidden px-3 py-2 font-medium md:table-cell">
                  Company
                </th>
                <th className="hidden px-3 py-2 font-medium lg:table-cell">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    {search
                      ? "No contacts match your search."
                      : "No contacts yet."}
                  </td>
                </tr>
              ) : (
                contacts.map((c, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-t border-white/10 text-slate-200"
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
                            <div className="truncate font-medium">
                              {c.fullName}
                            </div>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {total > maxPerPage && (
        <div className="sticky bottom-0 z-10 -mb-3 flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-neutral-950/80 px-2 py-3 backdrop-blur sm:flex-row">
          <div className="text-sm text-slate-400">
            Showing {firstItem}-{lastItem} of {total}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary/60"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || isPending}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {getPageNumbers().map((p, index) =>
              typeof p === "number" ? (
                <button
                  key={index}
                  onClick={() => goToPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 ${
                    p === page
                      ? "bg-primary/15 text-primary border border-primary/40"
                      : "border border-white/10 text-slate-200 hover:bg-white/5"
                  }`}
                  disabled={isPending}
                >
                  {p}
                </button>
              ) : (
                <span key={index} className="px-2 text-sm text-slate-500">
                  {p}
                </span>
              )
            )}
            <button
              className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary/60"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || isPending}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
