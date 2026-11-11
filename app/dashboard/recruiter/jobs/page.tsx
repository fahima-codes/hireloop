import React from 'react';
import Link from 'next/link';

const ManageJobsPage = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-semibold tracking-tight text-white">
        Manage Jobs
      </h1>
      {/* কাজ চলছে — এখানে per-job list/cards আসবে */}
      <Link
        href="/dashboard/recruiter/jobs/new"
        className="mt-4 inline-block rounded-xl bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-400"
      >
        Post a New Job
      </Link>
    </div>
  );
};

export default ManageJobsPage;
