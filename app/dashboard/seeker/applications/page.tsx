'use client';

// My Applications — seeker dashboard (/dashboard/seeker/applications)
// Project requirements.md: Job Title, Company, Date Applied, Status কলাম + View Details বাটন
// ডাটা আসে /applications API (hireloop-server) থেকে

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, Loader2 } from 'lucide-react';

import { StatusPill } from '@/app/components/StatusPill';
import { getApplications } from '@/lib/api/applications';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import { timeAgo } from '@/lib/utils/dates';
import type { ApplicationApiDoc, ApplicationStatus } from '@/lib/types/applications';

const STATUS_TABS = [
  'All',
  'Applied',
  'Under Review',
  'Shortlisted',
  'Rejected',
  'Offered',
] as const;
type StatusTab = (typeof STATUS_TABS)[number];

// API document → টেবিলের row — পুরনো/টেস্ট ডকুমেন্টে appliedAt/status মিসিং থাকলে ডিফল্ট
// ObjectId-র প্রথম ৪ বাইট = তৈরির টাইমস্ট্যাম্প — manage jobs-এর toManagedJob-এর মতোই fallback
function toApplicationRow(doc: ApplicationApiDoc): ApplicationApiDoc {
  const createdAtMs = parseInt(String(doc._id).slice(0, 8), 16) * 1000;
  return {
    ...doc,
    appliedAt:
      doc.appliedAt ??
      (Number.isFinite(createdAtMs)
        ? new Date(createdAtMs).toISOString()
        : ''),
    status: doc.status ?? 'Applied',
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationApiDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<StatusTab>('All');

  // সব setState .then/.catch/.finally কলব্যাকে — effect বডিতে sync setState নেই
  const loadApplications = useCallback(() => {
    return getApplications()
      .then(docs => {
        // পুরনো ডকুমেন্টে মিসিং ফিল্ডগুলো ডিফল্ট দিয়ে পূরণ করে নিই
        setApplications(docs.map(toApplicationRow));
        setError(null);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Something went wrong loading applications',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // নতুন apply আগে দেখানোর জন্য appliedAt অনুযায়ী নামিয়ে সাজাই
  const sortedApplications = useMemo(
    () =>
      [...applications].sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      ),
    [applications],
  );

  const filteredApplications = useMemo(
    () =>
      sortedApplications.filter(
        app => statusTab === 'All' || app.status === statusTab,
      ),
    [sortedApplications, statusTab],
  );

  const countFor = (tab: StatusTab) =>
    tab === 'All'
      ? sortedApplications.length
      : sortedApplications.filter(app => app.status === (tab as ApplicationStatus))
          .length;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* হেডার */}
      <header>
        <h1 className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
          My Applications
        </h1>
        <p className={`mt-1 text-sm ${textMuted}`}>
          Track the status of every job you&apos;ve applied to.
        </p>
      </header>

      {/* সেগমেন্টেড ট্যাব — All + status অনুযায়ী কাউন্টসহ (manage jobs পেজের মতোই) */}
      <div className="mt-8 flex h-[42px] w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#1a1a1f] p-1">
        {STATUS_TABS.map(tab => {
          const isActive = statusTab === tab;
          return (
            <button
              key={tab}
              type="button"
              aria-pressed={isActive}
              onClick={() => setStatusTab(tab)}
              className={`h-8 shrink-0 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : `${textMuted} hover:bg-white/5`
              }`}
            >
              {tab} ({countFor(tab)})
            </button>
          );
        })}
      </div>

      {/* লোড/এরর বার্তা */}
      {(isLoading || error) && (
        <p
          className={`mt-5 flex items-center gap-2 text-sm ${
            error ? 'text-[#f59e0b]' : textMuted
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading applications…
            </>
          ) : (
            <>
              {error}
              <button
                type="button"
                onClick={loadApplications}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-[#ededef] hover:bg-white/10"
              >
                Retry
              </button>
            </>
          )}
        </p>
      )}

      {/* ডাটা টেবিল — মোবাইলে হরিজন্টাল স্ক্রল */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr
                className={`border-b border-white/10 bg-[#1a1a1f] text-xs ${textFaint}`}
              >
                <th className="px-4 py-3 font-medium">Job Title</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Date Applied</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                // লোডিং স্কেলিটন — ৫টা সারি
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/10 last:border-0"
                  >
                    {Array.from({ length: 5 }).map((__, c) => (
                      <td key={c} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-white/[0.06]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-16 text-center text-sm ${textMuted}`}
                  >
                    No applications yet. Browse jobs and apply to see them here.
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className={`px-4 py-16 text-center text-sm ${textMuted}`}
                  >
                    No applications with “{statusTab}” status.
                  </td>
                </tr>
              ) : (
                filteredApplications.map(app => (
                  <tr
                    key={app._id}
                    className="border-b border-white/10 transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    {/* Title + category/type — Figma-তে দুই লাইনের সেল */}
                    <td className="px-4 py-3">
                      <div className={`font-medium ${textPrimary}`}>
                        {app.jobTitle}
                      </div>
                      <div className={`mt-0.5 text-xs ${textMuted}`}>
                        {app.category} · {app.jobType} · {app.location}
                      </div>
                    </td>
                    {/* Company — ইনিশিয়াল অ্যাভাটার */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#222228] text-sm text-[#ededef]">
                          {app.company.charAt(0)}
                        </span>
                        <span className={textPrimary}>{app.company}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${textMuted}`}>
                      {timeAgo(app.appliedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={app.status} />
                    </td>
                    {/* View Details — job listing-এ নিয়ে যায় (requirements.md অনুযায়ী) */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/BrowseJobs/${app.jobId}`}
                        className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-[#ededef] transition-colors hover:bg-white/10"
                      >
                        <Eye className="size-3.5" />
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
