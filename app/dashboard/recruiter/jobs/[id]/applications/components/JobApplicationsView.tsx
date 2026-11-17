'use client';

// Job Applications — recruiter-এর নির্দিষ্ট একটা job-এর applicant তালিকা
// (/dashboard/recruiter/jobs/[id]/applications)
// ডাটা server page থেকে props-এ আসে — applicant-এর স্ট্যাটাস আপডেট (DB mutation)
// পরে এই view-তেই যোগ হবে

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { StatusPill } from '@/app/components/StatusPill';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateApplicationStatus } from '@/lib/api/applications';
import { applicationStatuses } from '@/lib/constants/applications';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import { timeAgo } from '@/lib/utils/dates';
import type {
  ApplicationApiDoc,
  ApplicationStatus,
} from '@/lib/types/applications';
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

  // সার্স-অব-ট্রুথ থাকে props-এ — এখানে শুধু সফল আপডেটের status ওভাররাইড রাখি
  // (key = application _id)। না করলে id বদলে navigate করলে পুরনো state আটকে থাকত।
  const [updatedStatuses, setUpdatedStatuses] = useState<
    Record<string, ApplicationStatus>
  >({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ড্রপডাউন বদলালেই DB-তে PATCH — সফল হলে ওভাররাইডে রাখি, ব্যর্থ হলে এরর দেখাই
  const handleStatusChange = (
    app: ApplicationApiDoc,
    next: ApplicationStatus,
  ) => {
    if (next === (updatedStatuses[app._id] ?? app.status)) return;
    setError(null);
    setPendingId(app._id);
    updateApplicationStatus(app._id, next)
      .then(() => {
        setUpdatedStatuses(prev => ({ ...prev, [app._id]: next }));
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Something went wrong updating the status',
        );
      })
      .finally(() => {
        setPendingId(null);
      });
  };

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

      {/* status আপডেট ব্যর্থ হলে এরর বার্তা (manage jobs-এর মতোই) */}
      {error && (
        <p className="mt-5 text-sm text-[#f59e0b]">{error}</p>
      )}

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
                      <div className="flex items-center gap-2">
                        <StatusPill
                          status={updatedStatuses[app._id] ?? app.status}
                        />
                        {/* recruiter-এর status আপডেট — বদলালেই PATCH /applications/:id চলে */}
                        <Select
                          value={updatedStatuses[app._id] ?? app.status}
                          onValueChange={value =>
                            handleStatusChange(
                              app,
                              value as ApplicationStatus,
                            )
                          }
                        >
                          <SelectTrigger
                            aria-label={`Update status for ${app.name}`}
                            disabled={pendingId === app._id}
                            className="h-8 w-[130px] rounded-lg border-white/10 bg-[#1a1a1f] text-xs"
                          >
                            {pendingId === app._id ? (
                              <span className="flex items-center gap-1.5">
                                <Loader2 className="size-3 animate-spin" />
                                Saving…
                              </span>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {applicationStatuses.map(status => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
