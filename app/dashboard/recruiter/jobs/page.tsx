'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';

import { DeleteJobDialog } from '@/app/components/DeleteJobDialog';
import { DeleteSuccessDialog } from '@/app/components/DeleteSuccessDialog';
import { FilterSelect } from '@/app/components/FilterSelect';
import { IconButton } from '@/app/components/IconButton';
import { InsightCard } from '@/app/components/InsightCard';
import { StatusPill } from '@/app/components/StatusPill';
import { jobCategories, jobStatuses } from '@/lib/constants/jobs';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import { deleteJob, getJobs } from '@/lib/api/jobs';
import type { JobApiDoc, JobStatus, ManagedJob } from '@/lib/types/jobs';

const inputClass =
  'h-[38px] w-full rounded-xl border-white/10 bg-[#0c0c0f] text-sm text-[#ededef] focus-visible:border-white/20';
const labelClass = 'mb-2 block text-xs text-[#a0a0ab]';

// API document → টেবিলের row — মিসিং ফিল্ডগুলো ডিফল্ট দিয়ে পূরণ
// নতুন তৈরি job-এ status/postedAt/applicants থাকে না
function toManagedJob(doc: JobApiDoc): ManagedJob {
  // ObjectId-র প্রথম ৪ বাইট = তৈরির টাইমস্ট্যাম্প — ওটা থেকেই posted date
  const createdAtMs = parseInt(String(doc._id).slice(0, 8), 16) * 1000;
  return {
    ...doc,
    _id: String(doc._id),
    ref: doc.ref ?? `HL-${String(doc._id).slice(-5).toUpperCase()}`,
    status: doc.status === 'Closed' ? 'Closed' : 'Active',
    postedAt:
      doc.postedAt ??
      (Number.isFinite(createdAtMs)
        ? new Date(createdAtMs).toISOString().slice(0, 10)
        : ''),
    applicants: doc.applicants ?? 0,
    views: doc.views ?? 0,
  };
}

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<ManagedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // ডিলিট কনফার্ম ডায়লগের টার্গেট — null মানে ডায়লগ বন্ধ
  const [deleteTarget, setDeleteTarget] = useState<ManagedJob | null>(null);
  // ডিলিট সাকসেস ডায়লগ — true মানে দেখাবে
  const [showSuccess, setShowSuccess] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<JobStatus | 'All'>('All');

  // সব setState .then/.catch/.finally কলব্যাকে — effect বডিতে sync setState নেই
  const loadJobs = useCallback(() => {
    return getJobs()
      .then(docs => {
        setJobs(docs.map(toManagedJob));
        setError(null);
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error ? e.message : 'Something went wrong loading jobs',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleDelete = async (id: string) => {
    console.log('[DeleteJob] confirm →', 'deleting job id:', id);
    setDeletingId(id);
    setError(null);
    try {
      await deleteJob(id);
      // সফল হলে লোকালি সরিয়ে দিই — আবার refetch লাগে না
      setJobs(prev => prev.filter(job => job._id !== id));
      console.log('[DeleteJob] ✅ success — removed from list:', id);
      setShowSuccess(true);
    } catch (e) {
      // এখানে network failure / CORS / 404-500 response সব ধরা পড়বে
      console.error('[DeleteJob] ❌ error —', e);
      setError(e instanceof Error ? e.message : 'Failed to delete job');
    } finally {
      setDeletingId(null);
    }
  };

  // ডায়লগের Delete চাপলে — ডায়লগ বন্ধ করে আসল ডিলিট চালাই
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setDeleteTarget(null);
    void handleDelete(id);
  };

  // Success dialog er Done chaple — refresh hobe
  const handleSuccessClose = () => {
    setShowSuccess(false);
    void loadJobs();
  };

  const filteredJobs = useMemo(
    () =>
      jobs.filter(
        job =>
          (statusTab === 'All' || job.status === statusTab) &&
          (!statusFilter || job.status === statusFilter) &&
          (!categoryFilter || job.category === categoryFilter),
      ),
    [jobs, statusTab, statusFilter, categoryFilter],
  );

  const activeCount = jobs.filter(j => j.status === 'Active').length;
  const closedCount = jobs.length - activeCount;

  // Bento insights — আসল ডাটা থেকেই হিসাব
  const totalApplicants = jobs.reduce((s, j) => s + j.applicants, 0);
  const totalViews = jobs.reduce((s, j) => s + j.views, 0);
  const engagementRate =
    totalViews > 0
      ? `${((totalApplicants / totalViews) * 100).toFixed(1)}%`
      : '—';

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* হেডার — টাইটেল + ডানপাশে Create Job (Figma: সাদা বাটন) */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-semibold tracking-tight ${textPrimary}`}
          >
            Manage Jobs
          </h1>
          <p className={`mt-1 text-sm ${textMuted}`}>
            Track, edit, and manage all of your job posts in one place.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#fafafa] px-4 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
        >
          <Plus className="size-4" />
          Create Job
        </Link>
      </header>

      {/* ফিল্টার সেকশন — Status/Category সিলেক্ট + Active/Closed ট্যাব */}
      <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
          <div className="w-full lg:w-[262px]">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="All Statuses"
              options={jobStatuses}
              triggerClassName={inputClass}
              labelClassName={labelClass}
            />
          </div>
          <div className="w-full lg:w-[262px]">
            <FilterSelect
              label="Category"
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              placeholder="All Categories"
              options={jobCategories}
              triggerClassName={inputClass}
              labelClassName={labelClass}
            />
          </div>
        </div>

        {/* সেগমেন্টেড ট্যাব — All / Active (n) / Closed (n) */}
        <div className="flex h-[42px] w-fit items-center gap-1 rounded-xl border border-white/10 bg-[#1a1a1f] p-1">
          {(['All', 'Active', 'Closed'] as const).map(tab => {
            const isActive = statusTab === tab;
            const count =
              tab === 'All'
                ? jobs.length
                : tab === 'Active'
                  ? activeCount
                  : closedCount;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => setStatusTab(tab)}
                className={`h-8 rounded-lg px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : `${textMuted} hover:bg-white/5`
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </section>

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
              Loading job posts…
            </>
          ) : (
            <>
              {error}
              <button
                type="button"
                onClick={loadJobs}
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
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr
                className={`border-b border-white/10 bg-[#1a1a1f] text-xs ${textFaint}`}
              >
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Date Posted</th>
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
                    {Array.from({ length: 7 }).map((__, c) => (
                      <td key={c} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-white/[0.06]" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`px-4 py-16 text-center text-sm ${textMuted}`}
                  >
                    {jobs.length === 0
                      ? 'No job posts yet. Create your first listing to see it here.'
                      : 'No job posts match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr
                    key={job._id}
                    className={`border-b border-white/10 last:border-0 transition-colors hover:bg-white/[0.03] ${
                      job.status === 'Closed' ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Title + Ref — Figma-তে দুই লাইনের সেল */}
                    <td className="px-4 py-3">
                      <div className={`font-medium ${textPrimary}`}>
                        {job.title}
                      </div>
                      <div className={`mt-0.5 text-xs ${textMuted}`}>
                        Ref: {job.ref} · {job.location}
                      </div>
                    </td>
                    {/* Company — ইনিশিয়াল অ্যাভাটার */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#222228] text-sm text-[#ededef]">
                          {job.company.charAt(0)}
                        </span>
                        <span className={textPrimary}>{job.company}</span>
                      </div>
                    </td>
                    {/* Category — বর্ডার্ড ব্যাজ */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md border border-white/10 bg-[#1a1a1f] px-3 py-1 text-xs ${textPrimary}`}
                      >
                        {job.category}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${textMuted}`}>{job.jobType}</td>
                    <td className={`px-4 py-3 ${textMuted}`}>
                      {job.postedAt
                        ? dateFmt.format(new Date(job.postedAt))
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={job.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          label={`View ${job.title}`}
                          title="View job post"
                          icon={<Eye className="size-4" />}
                        />
                        <IconButton
                          label={`Edit ${job.title}`}
                          title="Edit job post"
                          icon={<Pencil className="size-4" />}
                        />
                        {/* শেষ অ্যাকশন — Delete (কনফার্ম ডায়লগ খোলে) */}
                        <IconButton
                          label={`Delete ${job.title}`}
                          title={
                            job.status === 'Active'
                              ? 'Delete job post'
                              : 'Delete closed job post'
                          }
                          variant="danger"
                          icon={
                            deletingId === job._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )
                          }
                          onClick={() => setDeleteTarget(job)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bento স্টাইল ইনসাইট গ্রিড */}
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          icon={<TrendingUp className="size-4" />}
          label="Engagement Rate"
          value={engagementRate}
          note="+5.2% from last month"
          noteTone="positive"
        />
        <InsightCard
          icon={<Clock className="size-4" />}
          label="Avg. Time to Fill"
          value="14 Days"
          note="Stable performance"
        />
        <InsightCard
          icon={<Users className="size-4" />}
          label="Total Applications"
          value={totalApplicants.toLocaleString('en-US')}
          note="-2.1% across tech sectors"
          noteTone="warning"
        />
      </section>

      {/* Delete কনফার্ম ডায়লগ — shadcn AlertDialog (app/components/DeleteJobDialog) */}
      <DeleteJobDialog
        open={deleteTarget !== null}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null);
        }}
        jobTitle={deleteTarget?.title}
        onConfirm={confirmDelete}
      />

      {/* Delete Success ডায়লগ — Done chaple refresh hobe */}
      <DeleteSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
