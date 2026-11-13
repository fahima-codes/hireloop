// Browse Jobs পেজের বাম সাইডবার "Filters" প্যানেল —
// এক বা একাধিক FilterCheckboxGroup নেয়, তাই নতুন ফিল্টার যোগ করা সহজ

'use client';

import {
  FilterCheckboxGroup,
  type FilterOption,
} from '@/app/components/FilterCheckboxGroup';

export type FilterGroup = {
  title: string;
  options: readonly FilterOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
};

export function JobsFilterPanel({
  groups,
}: {
  groups: readonly FilterGroup[];
}) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-[#141418] p-5">
      <h2 className="text-base font-semibold text-white">Filters</h2>
      <div className="mt-4 space-y-5">
        {groups.map(group => (
          <FilterCheckboxGroup key={group.title} {...group} />
        ))}
      </div>
    </aside>
  );
}
