// একটা ফিল্টার গ্রুপ — টাইটেল + কাউন্টসহ checkbox অপশন লিস্ট
// Browse Jobs সাইডবারে Job Type/Category/Work Mode গ্রুপে রি-ইউজ হয়

'use client';

import { Check } from 'lucide-react';

export type FilterOption = {
  label: string;
  count: number;
};

type FilterCheckboxGroupProps = {
  title: string;
  options: readonly FilterOption[];
  selected: readonly string[];
  onToggle: (value: string) => void;
};

export function FilterCheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: FilterCheckboxGroupProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-zinc-200">{title}</legend>
      <ul className="space-y-2.5">
        {options.map(option => {
          const checked = selected.includes(option.label);
          return (
            <li key={option.label}>
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="flex items-center gap-2.5">
                  {/* sr-only input + peer স্টাইলিং — কাস্টম চেকবক্স, কিবোর্ড/স্ক্রিন রিডার অ্যাক্সেসিবল */}
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(option.label)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className="grid size-4 shrink-0 place-items-center rounded-[5px] border border-white/20 bg-white/[0.04] text-transparent transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-zinc-950"
                  >
                    <Check className="size-3" />
                  </span>
                  <span
                    className={`text-sm transition-colors ${
                      checked ? 'text-zinc-100' : 'text-zinc-400'
                    }`}
                  >
                    {option.label}
                  </span>
                </span>
                <span className="text-xs text-zinc-500">{option.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
