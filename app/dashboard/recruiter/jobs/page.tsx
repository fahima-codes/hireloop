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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  deleteJob,
  getJobs,
  type JobApiDoc,
} from '@/lib/api/jobs';
import type { JobFormData } from '@/lib/actions/jobs';

// Figma "Manage Jobs" স্ক্রিন অনুযায়ী কালার টোকেন
const textPrimary = 'text-[#ededef]';
const textMuted = 'text-[#a0a0ab]';
const textFaint = 'text-[#6e6e78]';

type JobStatus = 'Active' | 'Closed';

// API document + টেবিলে দরকারি ডেরাইভ করা মেটাডাটা
type ManagedJob = JobFormData & {
  _id: string;
  ref: string;
  status: JobStatus;
  postedAt: string;
  applicants: number;
  views: number;
};

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

const jobCategories = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Data & Analytics',
  'Human Resources',
  'Customer Support',
  'Other',
];

const inputClass =
  'h-[38px] w-full rounded-xl border-white/10 bg-[#0c0c0f] text-sm text-[#ededef] focus-visible:border-white/20';
const labelClass = 'mb-2 block text-xs text-[#a0a0ab]';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// স্ট্যাটাস পিল — Active সবুজ (#22c55e), Closed ধূসর
function StatusPill({ status }: { status: JobStatus }) {
  const active = status === 'Active';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? 'bg-[#22c55e]/15 text-[#22c55e]'
          : 'bg-[#a1a4aa]/15 text-[#a0a0ab]'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          active ? 'bg-[#22c55e]' : 'bg-[#a1a4aa]'
        }`}
      />
      {status}
    </span>
  );
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<ManagedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // ডিলিট কনফার্ম ডায়লগের টার্গেট — null মানে ডায়লগ বন্ধ
  const [deleteTarget, setDeleteTarget] = useState<ManagedJob | null>(null);

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
          e instanceof Error
            ? e.message
            : 'Something went wrong loading jobs',
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
    setDeletingId(id);
    setError(null);
    try {
      await deleteJob(id);
      // সফল হলে লোকালি সরিয়ে দিই — আবার refetch লাগে না
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (e) {
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
          <h1 className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
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
            <Label className={labelClass}>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-[262px]">
            <Label className={labelClass}>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <tr className={`border-b border-white/10 bg-[#1a1a1f] text-xs ${textFaint}`}>
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
                  <tr key={i} className="border-b border-white/10 last:border-0">
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
                        <button
                          type="button"
                          aria-label={`View ${job.title}`}
                          title="View job post"
                          className="flex size-8 items-center justify-center rounded-lg text-[#c4c7c8] hover:bg-white/10 hover:text-white"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Edit ${job.title}`}
                          title="Edit job post"
                          className="flex size-8 items-center justify-center rounded-lg text-[#c4c7c8] hover:bg-white/10 hover:text-white"
                        >
                          <Pencil className="size-4" />
                        </button>
                        {/* শেষ অ্যাকশন — Delete (কনফার্ম ডায়লগ খোলে) */}
                        <button
                          type="button"
                          aria-label={`Delete ${job.title}`}
                          title={
                            job.status === 'Active'
                              ? 'Delete job post'
                              : 'Delete closed job post'
                          }
                          onClick={() => setDeleteTarget(job)}
                          className="flex size-8 items-center justify-center rounded-lg text-[#c4c7c8] hover:bg-red-500/10 hover:text-red-400"
                        >
                          {deletingId === job._id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
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
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
            <TrendingUp className="size-4" />
            Engagement Rate
          </div>
          <p className={`mt-4 text-2xl font-semibold ${textPrimary}`}>
            {engagementRate}
          </p>
          <p className="mt-4 text-xs text-[#22c55e]">+5.2% from last month</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
            <Clock className="size-4" />
            Avg. Time to Fill
          </div>
          <p className={`mt-4 text-2xl font-semibold ${textPrimary}`}>
            14 Days
          </p>
          <p className={`mt-4 text-xs ${textMuted}`}>Stable performance</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
            <Users className="size-4" />
            Total Applications
          </div>
          <p className={`mt-4 text-2xl font-semibold ${textPrimary}`}>
            {totalApplicants.toLocaleString('en-US')}
          </p>
          <p className="mt-4 text-xs text-[#f59e0b]">-2.1% across tech sectors</p>
        </div>
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
    </div>
  );
}
