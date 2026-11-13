// Browse Jobs পেজের টপ সার্চ বার — Figma: ইনপুট + ডানপাশে "Search Jobs" বাটন

'use client';

import type { FormEvent } from 'react';
import { Search } from 'lucide-react';

type JobSearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
};

export function JobSearchBar({ value, onValueChange }: JobSearchBarProps) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // TODO: search query অনুযায়ী jobs fetch/filter করার লজিক এখানে বসবে — ইচ্ছাকৃতভাবে খালি
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#141418] p-2"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
        <Search className="size-4 shrink-0 text-zinc-500" aria-hidden />
        <input
          type="text"
          value={value}
          onChange={event => onValueChange(event.target.value)}
          placeholder="Search by job title, keywords..."
          aria-label="Search by job title, keywords"
          className="h-8 w-full min-w-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="h-10 shrink-0 rounded-xl bg-[#fafafa] px-5 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
      >
        Search Jobs
      </button>
    </form>
  );
}
