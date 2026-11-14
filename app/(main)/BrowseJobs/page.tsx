import type { Metadata } from 'next';

import { BrowseJobsView } from '@/app/(main)/BrowseJobs/components/BrowseJobsView';
import { getJobs } from '@/lib/api/jobs';

// এই লাইনটি যোগ করলে এরর চলে যাবে
export const instant = false;

export const metadata: Metadata = {
  title: 'Browse Jobs — HireLoop',
};

const BrowseJobsPage = async () => {
  // আপাতত query ছাড়া সব job — filter/search বসানোর পর query পাঠানো হবে
  const jobs = await getJobs();
  return <BrowseJobsView jobs={jobs} />;
};
export default BrowseJobsPage;
