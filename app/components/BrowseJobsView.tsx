// Browse Jobs পেজের ক্লায়েন্ট ভিউ — সার্চ বার + ফিল্টার সাইডবার + job কার্ড লিস্ট + pagination
// filter/search হ্যান্ডলার ইচ্ছাকৃতভাবে খালি (শুধু সিলেকশন স্টেট টগল হয়) — আসল লজিক পরে বসবে

'use client';

import { useMemo, useState } from 'react';

import { JobCard } from '@/app/components/JobCard';
import { JobPagination } from '@/app/components/JobPagination';
import { JobSearchBar } from '@/app/components/JobSearchBar';
import {
  JobsFilterPanel,
  type FilterGroup,
} from '@/app/components/JobsFilterPanel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { jobCategories, jobTypes } from '@/lib/constants/jobs';
import { textMuted, textPrimary } from '@/lib/constants/ui';
import type { JobApiDoc } from '@/lib/types/jobs';

const PAGE_SIZE = 5;
const workModes = ['Remote', 'On-site'] as const;
const sortOptions = ['Most Recent', 'Oldest'] as const;
type SortOption = (typeof sortOptions)[number];

// ObjectId-র প্রথম ৪ বাইট = তৈরির টাইমস্ট্যাম্প — manage jobs পেজের মতোই এখান থেকে sort
const postedMs = (job: JobApiDoc) =>
  parseInt(String(job._id).slice(0, 8), 16) * 1000;

// ফিল্টার অপশন + প্রতিটার job count বের করে
function optionsWithCounts(
  jobs: JobApiDoc[],
  values: readonly string[],
  matches: (job: JobApiDoc, value: string) => boolean,
) {
  return values.map(value => ({
    label: value,
    count: jobs.filter(job => matches(job, value)).length,
  }));
}

const toggleValue = (list: string[], value: string) =>
  list.includes(value) ? list.filter(item => item !== value) : [...list, value];

export function BrowseJobsView({ jobs }: { jobs: JobApiDoc[] }) {
  const [searchText, setSearchText] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('Most Recent');
  const [page, setPage] = useState(1);

  // ---------- হ্যান্ডলার ----------
  // TODO: ফিল্টার পরিবর্তনে job list আপডেটের লজিক এখানে বসবে — আপাতত শুধু সিলেকশন স্টেট টগল হয়
  const handleJobTypeToggle = (value: string) =>
    setSelectedJobTypes(prev => toggleValue(prev, value));
  const handleCategoryToggle = (value: string) =>
    setSelectedCategories(prev => toggleValue(prev, value));
  const handleWorkModeToggle = (value: string) =>
    setSelectedWorkModes(prev => toggleValue(prev, value));

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setPage(1); // সর্ট বদলালে প্রথম পেজ থেকে শুরু
  };

  // ---------- ডেরাইভ করা ডাটা ----------
  const filterGroups: FilterGroup[] = [
    {
      title: 'Job Type',
      options: optionsWithCounts(
        jobs,
        jobTypes,
        (job, value) => job.jobType === value,
      ),
      selected: selectedJobTypes,
      onToggle: handleJobTypeToggle,
    },
    {
      title: 'Category',
      options: optionsWithCounts(
        jobs,
        jobCategories,
        (job, value) => job.category === value,
      ),
      selected: selectedCategories,
      onToggle: handleCategoryToggle,
    },
    {
      title: 'Work Mode',
      options: workModes.map(mode => ({
        label: mode,
        count: jobs.filter(job =>
          mode === 'Remote' ? job.remoteAllowed : !job.remoteAllowed,
        ).length,
      })),
      selected: selectedWorkModes,
      onToggle: handleWorkModeToggle,
    },
  ];

  const sortedJobs = useMemo(() => {
    const oldestFirst = [...jobs].sort((a, b) => postedMs(a) - postedMs(b));
    return sortBy === 'Oldest' ? oldestFirst : oldestFirst.reverse();
  }, [jobs, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleJobs = sortedJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <JobSearchBar value={searchText} onValueChange={setSearchText} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <JobsFilterPanel groups={filterGroups} />

        <section>
          {/* হেডার — found count + ডানপাশে sort select */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`text-lg font-medium ${textPrimary}`}>
              Found {jobs.length.toLocaleString('en-US')} Professional Jobs
            </p>
            <div className={`flex items-center gap-2 text-sm ${textMuted}`}>
              Sort by:
              <Select
                value={sortBy}
                onValueChange={value => handleSortChange(value as SortOption)}
              >
                <SelectTrigger
                  size="sm"
                  className="w-36 rounded-xl border-white/10 bg-[#141418] text-zinc-200"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Job কার্ড লিস্ট */}
          <div className="mt-4 flex flex-col gap-4">
            {visibleJobs.length === 0 ? (
              <p
                className={`rounded-2xl border border-white/10 bg-[#141418] px-5 py-16 text-center text-sm ${textMuted}`}
              >
                No jobs found. Check back later or adjust the filters.
              </p>
            ) : (
              visibleJobs.map(job => <JobCard key={job._id} job={job} />)
            )}
          </div>

          {totalPages > 1 && (
            <JobPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8 justify-center"
            />
          )}
        </section>
      </div>
    </div>
  );
}
