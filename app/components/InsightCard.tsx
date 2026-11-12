// Bento স্টাইল ইনসাইট কার্ড — manage jobs পেজের নিচের ৩টা স্ট্যাট কার্ড
// পেজ থেকে রি-ইউজেবল করে বের করা হয়েছে

import type { ReactNode } from 'react';

import { textMuted, textPrimary } from '@/lib/constants/ui';

type InsightCardProps = {
  /** lucide আইকন — caller নিজে className দেবে */
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  noteTone?: 'positive' | 'warning' | 'muted';
};

const noteToneClass = {
  positive: 'text-[#22c55e]',
  warning: 'text-[#f59e0b]',
  muted: textMuted,
} as const;

export function InsightCard({
  icon,
  label,
  value,
  note,
  noteTone = 'muted',
}: InsightCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
      <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
        {icon}
        {label}
      </div>
      <p className={`mt-4 text-2xl font-semibold ${textPrimary}`}>{value}</p>
      <p className={`mt-4 text-xs ${noteToneClass[noteTone]}`}>{note}</p>
    </div>
  );
}
