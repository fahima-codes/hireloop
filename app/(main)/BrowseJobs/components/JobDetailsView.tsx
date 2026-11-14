// Browse Jobs পেজের job details ভিউ — Figma ডিজাইন অনুযায়ী:
// header কার্ড + ৪টা stat কার্ড + বামে Responsibilities/Requirements + ডানে Company Overview
// apply/bookmark হ্যান্ডলার ইচ্ছাকৃতভাবে খালি — আসল লজিক পরে বসবে

'use client';

import {
  BadgeCheck,
  Banknote,
  Bookmark,
  Briefcase,
  Layers,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

import { formatSalary } from '@/app/(main)/BrowseJobs/components/JobCard';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import type { JobApiDoc } from '@/lib/types/jobs';

// responsibilities/requirements টেক্সট ফিল্ড — নতুন লাইন/সেমিকোলন দিয়ে ভেঙে bullet লিস্ট বানায়
const toList = (raw: string) =>
  raw
    .split(/\r?\n|;/)
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);

// কোম্পানি লোগোর ডেটা নেই — নামের প্রথম অক্ষর দিয়ে ইনিশিয়াল অ্যাভাটার
const companyInitial = (company: string) =>
  company.charAt(0).toUpperCase() || '?';

const statIconClass = 'size-3.5';

export function JobDetailsView({ job }: { job: JobApiDoc }) {
  // TODO: apply ও bookmark-এর লজিক এখানে বসবে — আপাতত ইচ্ছাকৃতভাবে খালি
  const handleApply = () => {};
  const handleSave = () => {};
  const handleVisitWebsite = () => {};

  const responsibilities = toList(job.responsibilities);
  const requirements = toList(job.requirements);

  // Figma-র ৪ stat — Experience-এর কোনো ফিল্ড ব্যাকএন্ডে নেই, তাই শেষ কার্ডে Category দেখানো হয়
  const stats = [
    { icon: Banknote, label: 'Salary Range', value: formatSalary(job.salaryMin, job.salaryMax) },
    { icon: MapPin, label: 'Location', value: job.location },
    { icon: Briefcase, label: 'Job Type', value: job.jobType },
    { icon: Layers, label: 'Category', value: job.category },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* ব্রেডক্রাম্ব — Figma: "Public / Job Details" স্টাইল */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs ${textFaint}`}
      >
        <Link href="/BrowseJobs" className="transition-colors hover:text-zinc-300">
          Browse Jobs
        </Link>
        <span aria-hidden>/</span>
        <span>Job Details</span>
      </nav>

      {/* ---------- হেডার কার্ড ---------- */}
      <section className="mt-3 rounded-2xl border border-white/10 bg-[#141418] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden
              className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#222228] text-xl font-semibold text-[#ededef]"
            >
              {companyInitial(job.company)}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-white">{job.title}</h1>
              <p className={`mt-1.5 flex flex-wrap items-center gap-2 text-sm ${textMuted}`}>
                <span>{job.company}</span>
                <span aria-hidden>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <BadgeCheck className="size-4" aria-hidden />
                  Verified Employer
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Save job"
              onClick={handleSave}
              className="grid size-9 place-items-center rounded-lg border border-white/10 text-[#c4c7c8] transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bookmark className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-9 shrink-0 rounded-xl bg-[#fafafa] px-5 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* ---------- ৪টা stat কার্ড ---------- */}
      <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-[#141418] p-5"
          >
            <stat.icon className={statIconClass} aria-hidden />
            <p
              className={`mt-2.5 text-[10px] font-medium uppercase tracking-wider ${textMuted}`}
            >
              {stat.label}
            </p>
            <p className={`mt-1 truncate text-sm font-medium ${textPrimary}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* ---------- বামে description কলাম + ডানে company overview ---------- */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
        <section className="rounded-2xl border border-white/10 bg-[#141418] px-6 py-2">
          {responsibilities.length > 0 && (
            <div className="py-5">
              <h2 className="text-lg font-semibold text-white">
                Responsibilities
              </h2>
              <ul className="mt-4 space-y-3">
                {responsibilities.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#a0a0ab]"
                    />
                    <span className={`text-sm ${textMuted}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="border-t border-white/10 py-5">
              <h2 className="text-lg font-semibold text-white">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {requirements.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#a0a0ab]"
                    />
                    <span className={`text-sm ${textMuted}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Company Overview — সাইডবার */}
        <aside className="rounded-2xl border border-white/10 bg-[#141418] p-5">
          <h2 className="text-base font-semibold text-white">
            Company Overview
          </h2>

          {/* কোম্পানির ছবি/লোগোর ডেটা নেই — ইনিশিয়াল placeholder */}
          <div className="mt-4 grid aspect-video place-items-center rounded-xl border border-white/5 bg-[#0c0c0f]">
            <span
              aria-hidden
              className="text-4xl font-semibold text-[#ededef]"
            >
              {companyInitial(job.company)}
            </span>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className={`text-xs ${textMuted}`}>Size</dt>
              <dd className={`text-right ${textPrimary}`}>Not specified</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className={`text-xs ${textMuted}`}>Industry</dt>
              <dd className={`text-right ${textPrimary}`}>{job.category}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleVisitWebsite}
            className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm text-[#ededef] transition-colors hover:bg-white/10"
          >
            Visit Website
          </button>
        </aside>
      </div>
    </div>
  );
}
