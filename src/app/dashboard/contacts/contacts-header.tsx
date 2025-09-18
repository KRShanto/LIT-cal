"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function ContactsHeader({
  defaultQuery,
  onOpenCreate,
}: {
  defaultQuery: string;
  onOpenCreate: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(defaultQuery || "");

  const onSearch = () => {
    const params = new URLSearchParams(searchParams?.toString());
    if (query.trim()) params.set("search", query.trim());
    else params.delete("search");
    params.set("page", "1");
    const url = `${pathname}?${params.toString()}`;
    startTransition(() => router.push(url));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-semibold tracking-tight text-white">
        Contacts
      </h1>
      <div className="flex w-full gap-2 sm:w-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="flex w-full gap-2 sm:w-auto"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, company..."
            className="flex-1 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-0 sm:w-80"
            aria-label="Search contacts"
          />
          <button
            type="submit"
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all duration-200"
            disabled={isPending}
          >
            Search
          </button>
        </form>
        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded-md border border-primary/60 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
        >
          New contact
        </button>
      </div>
    </div>
  );
}
