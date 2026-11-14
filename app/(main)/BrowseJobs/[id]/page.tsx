import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobDetailsView } from '@/app/(main)/BrowseJobs/components/JobDetailsView';
import { getJob } from '@/lib/api/jobs';

// পেজ প্রতি request-এ API থেকে job ফেচ করে — listing পেজের মতোই instant-validation opt-out
export const instant = false;

export const metadata: Metadata = {
  title: 'Job Details — HireLoop',
};

// params একটা Promise — await করে id বের করতে হয় (sync access করলে Next error দেয়)
const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const job = await getJob(id);
  // না পাওয়া গেলে (id ভুল বা job ডিলিট হয়ে গেলে) 404
  if (!job) notFound();

  return <JobDetailsView job={job} />;
};

export default JobDetailsPage;
