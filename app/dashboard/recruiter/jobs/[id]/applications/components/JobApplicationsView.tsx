'use client';

// Job Applications — recruiter-এর নির্দিষ্ট একটা job-এর applicant তালিকা
// (/dashboard/recruiter/jobs/[id]/applications)
// ডাটা server page থেকে props-এ আসে — applicant-এর স্ট্যাটাস আপডেট (DB mutation)
// পরে এই view-তেই যোগ হবে

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { StatusPill } from '@/app/components/StatusPill';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import { timeAgo } from '@/lib/utils/dates';
import type { ApplicationApiDoc } from '@/lib/types/applications';
import type { JobApiDoc } from '@/lib/types/jobs';

type JobApplicationsViewProps = {
  job: JobApiDoc;
  applications: ApplicationApiDoc[];
};

export function JobApplicationsView({
  job,
  applications,
}: JobApplicationsViewProps) {
  // নতুন apply আগে দেখানোর জন্য appliedAt অনুযায়ী নামিয়ে সাজাই (seeker পেজের মতোই)
  const sortedApplications = useMemo(
    () =>
      [...applications].sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      ),
    [applications],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Back link — manage jobs টেবিলে ফেরত */}
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-[#a0a0ab] transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Back to Manage Jobs
      </Link>

      {/* হেডার — কোন job-এর application তা context হিসেবে দেখাই */}
      <header className="mt-3">
        <h1 className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
          {job.title} — Applications
        </h1>
        <p className={`mt-1 text-sm ${textMuted}`}>
          {job.company} · {job.location} · {sortedApplications.length}{' '}
          {sortedApplications.length === 1 ? 'applicant' : 'applicants'}
        </p>
      </header>

      {/* ডাটা টেবিল — মোবাইলে হরিজন্টাল স্ক্রল (অন্য dashboard টেবিলের মতোই) */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr
                className={`border-b border-white/10 bg-[#1a1a1f] text-xs ${textFaint}`}
              >
                <th className="px-4 py-3 font-medium">Applicant</th>
                <th className="px-4 py-3 font-medium">Date Applied</th>
                <th className="px-4 py-3 font-medium">Resume</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {sortedApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`px-4 py-16 text-center text-sm ${textMuted}`}
                  >
                    No applications for this job yet.
                  </td>
                </tr>
              ) : (
                sortedApplications.map(app => (
                  <tr
                    key={app._id}
                    className="border-b border-white/10 transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    {/* Applicant — name + email, দুই লাইনের সেল (manage jobs-এর Title সেলের মতোই) */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-sm text-[#ededef]">
                          {app.name?.charAt(0) ?? '?'}
                        </span>
                        <div>
                          <div className={`font-medium ${textPrimary}`}>
                            {app.name}
                          </div>
                          <div className={`mt-0.5 text-xs ${textMuted}`}>
                            {app.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${textMuted}`}>
                      {app.appliedAt ? timeAgo(app.appliedAt) : '—'}
                    </td>
                    {/* Resume — recruiter ভিউতে Resume link কলাম (requirements.md অনুযায়ী) */}
                    <td className="px-4 py-3">
                      {app.resumeLink ? (
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-[#ededef] transition-colors hover:bg-white/10"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className={textMuted}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={app.status} />
                      {/* TODO: স্ট্যাটাস আপডেট কন্ট্রোল এখানে বসবে —
                          DB mutation (recruiter status update) পরে যোগ হবে */}
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
