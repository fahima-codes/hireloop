// ‹ 1 2 3 … 42 › স্টাইলের pagination — Figma ডিজাইন অনুযায়ী সাদা active পিল

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from 'cn';

type JobPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

// পেজ নম্বরগুলোর মাঝে দরকার হলে 'ellipsis' বসিয়ে আইটেম লিস্ট বানায়
function pageItems(page: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return range(1, total);
  const pages = [...new Set([1, 2, 3, page - 1, page, page + 1, total])]
    .filter(item => item >= 1 && item <= total)
    .sort((a, b) => a - b);
  return pages.flatMap((item, index) =>
    index > 0 && item - pages[index - 1] > 1
      ? (['ellipsis', item] as const)
      : [item],
  );
}

export function JobPagination({
  page,
  totalPages,
  onPageChange,
  className,
}: JobPaginationProps) {
  const items = pageItems(page, totalPages);
  const buttonClass = (active: boolean) =>
    `grid size-9 place-items-center rounded-lg border text-sm transition-colors ${
      active
        ? 'border-transparent bg-white font-medium text-zinc-950'
        : 'border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
    }`;

  return (
    <nav
      aria-label="Job pages"
      className={cn('flex items-center gap-1.5', className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={`${buttonClass(false)} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronLeft className="size-4" />
      </button>
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-sm text-zinc-500"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
            className={buttonClass(item === page)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`${buttonClass(false)} disabled:pointer-events-none disabled:opacity-40`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
