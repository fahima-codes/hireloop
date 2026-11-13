// একটা job-এর লিস্ট কার্ড — Figma: লোগো অ্যাভাটার + টাইটেল/কোম্পানি + স্যালারি/টাইপ ব্যাজ + bookmark

'use client';

import { Banknote, Bookmark, Briefcase } from 'lucide-react';
import type { ReactNode } from 'react';

import { IconButton } from '@/app/components/IconButton';
import { textMuted, textPrimary } from '@/lib/constants/ui';
import type { JobApiDoc } from '@/lib/types/jobs';

// "140000" → "$140k" — সংখ্যা না পড়লে স্ট্রিংটাই দেখায়, দুই পাশ থেকে range বানায়
function formatSalary(min: string, max: string) {
  const format = (value: string) => {
    const amount = Number(value);
    if (!value) return null;
    return Number.isFinite(amount) && amount >= 1000
      ? `$${Math.round(amount / 1000)}k`
      : `$${value}`;
  };
  const from = format(min);
  const to = format(max);
  if (from && to) return `${from} - ${to}`;
  return from ?? to ?? '—';
}

// ছোট pill ব্যাজ — tone দিয়ে সাধারণ/সবুজ (Remote) ভ্যারিয়েন্ট
function JobBadge({
  icon,
  tone = 'default',
  children,
}: {
  icon?: ReactNode;
  tone?: 'default' | 'positive';
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${
        tone === 'positive'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : 'border-white/10 bg-[#1a1a1f] text-[#ededef]'
      }`}
    >
      {icon}
      {children}
    </span>
  );
}

export function JobCard({ job }: { job: JobApiDoc }) {
  // TODO: job save/bookmark করার লজিক এখানে বসবে — ইচ্ছাকৃতভাবে খালি
  const handleSave = () => {};

  return (
    <article className="rounded-2xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start gap-4">
        {/* কোম্পানি লোগোর জায়গায় ইনিশিয়াল অ্যাভাটার */}
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#222228] text-sm font-semibold text-[#ededef]"
        >
          {job.company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-base font-medium ${textPrimary}`}>
            {job.title}
          </h3>
          <p className={`mt-1 text-sm ${textMuted}`}>
            {job.company} • {job.location}
            {job.remoteAllowed ? ' (Remote)' : ''}
          </p>
        </div>
        <IconButton
          label={`Save ${job.title}`}
          title="Save job"
          icon={<Bookmark className="size-4" />}
          onClick={handleSave}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <JobBadge icon={<Banknote className="size-3.5" />}>
          {formatSalary(job.salaryMin, job.salaryMax)}
        </JobBadge>
        <JobBadge icon={<Briefcase className="size-3.5" />}>
          {job.jobType}
        </JobBadge>
        {job.remoteAllowed && <JobBadge tone="positive">Remote</JobBadge>}
      </div>
    </article>
  );
}
