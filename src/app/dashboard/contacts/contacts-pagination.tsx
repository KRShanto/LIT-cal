"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function ContactsPagination({
  page,
  total,
  pageSize,
  disabled,
  onPage,
}: {
  page: number;
  total: number;
  pageSize: number;
  disabled: boolean;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1);
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const windowSize = 1;
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

  return (
    <div className="sticky bottom-0 z-10 -mb-3 flex flex-col items-center justify-between gap-3 border-t border-white/10 bg-neutral-950/80 px-2 py-3 backdrop-blur sm:flex-row">
      <div className="text-sm text-slate-400">
        Showing {firstItem}-{lastItem} of {total}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-primary/60"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || disabled}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageNumbers().map((p, index) =>
          typeof p === "number" ? (
            <button
              key={index}
              onClick={() => onPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 ${
                p === page
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "border border-white/10 text-slate-200 hover:bg-white/5"
              }`}
              disabled={disabled}
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
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || disabled}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
