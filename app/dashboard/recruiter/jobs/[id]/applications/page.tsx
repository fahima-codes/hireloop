import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JobApplicationsView } from './components/JobApplicationsView';
import { getApplicationsByJob } from '@/lib/api/applications';
import { getJobById } from '@/lib/api/jobs';

// পেজ প্রতি request-এ API থেকে job + applications ফেচ করে — recruiter-এর
// স্ট্যাটাস আপডেট সাথে সাথে দেখা যায়, তাই listing পেজের মতোই instant-validation opt-out
export const instant = false;

export const metadata: Metadata = {
  title: 'Job Applications — HireLoop',
};

// params একটা Promise — await করে id বের করতে হয় (BrowseJobs/[id]-এর মতোই)
const JobApplicationsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const job = await getJobById(id);
  // job না পাওয়া গেলে (ভুল id বা ডিলিট হয়ে গেলে) 404
  if (!job) notFound();

  // এই job-এর applicant তালিকা — server-এ fetch করে client view-কে props-এ দিই
  const applications = await getApplicationsByJob(id);

  return <JobApplicationsView job={job} applications={applications} />;
};

export default JobApplicationsPage;
