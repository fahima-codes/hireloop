const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

import type { JobApiDoc } from '@/lib/types/jobs';

// টাইপ এখন শেয়ারড জায়গায় — lib/types/jobs.ts থেকে রি-এক্সপোর্ট,
// তাই পুরনো import path (`@/lib/api/jobs`) আগের মতোই কাজ করবে
export type { JobApiDoc } from '@/lib/types/jobs';

export const getJobs = async (query = ''): Promise<JobApiDoc[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`);
  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`);
  }
  const data = await res.json();
  // API বা তো সরাসরি array দেয়, নয়তো { jobs: [...] } ভেতরে
  return Array.isArray(data) ? data : (data.jobs ?? []);
};
// আগে `GET /jobs?id=...` কল করা হচ্ছিল — কিন্তু ব্যাকএন্ড query param-টা ignore করে
// পুরো job list ফেরত দেয়, আর আমরা jobs[0] নিয়ে নিতাম — তাই যে কার্ডেই click করি
// সবসময় প্রথম job-ই দেখাত। ব্যাকএন্ডে আলাদা REST endpoint (`GET /jobs/:id`) আছে
// (deleteJob-ও এই style-ই use করে) — সেটাই call করছি।
export const getJobById = async (
  jobId: string,
): Promise<JobApiDoc | null> => {
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`, {
    cache: 'no-store',
  });

  // job না পেলে (ভুল id বা ডিলিট হয়ে গেলে) page-এর notFound() কাজ করার জন্য
  // throw না করে null ফেরত দিই
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  // কিছু ব্যাকএন্ড খালি body দেয় — সেক্ষেত্রে null
  const job = data && typeof data === 'object' && !Array.isArray(data)
    ? (data.jobs?.[0] ?? data)
    : (data?.[0] ?? null);
  return (job as JobApiDoc) ?? null;
};

export const getJob = async (id: string): Promise<JobApiDoc | null> => {
  // আলাদা single-job endpoint (`GET /jobs/:id`) use করছি — `?id=` query param
  // ব্যাকএন্ড ignore করে পুরো list ফেরত দেয়
  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(id)}`);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const jobs = Array.isArray(data) ? data : (data.jobs ?? [data]);
  return jobs[0] ?? null;
};

export const deleteJob = async (id: string) => {
  const url = `${BASE_URL}/jobs/${id}`;
  // ডিবাগ — ব্রাউজার কনসোলে দেখা যাবে
  console.log('[DeleteJob] request →', 'DELETE', url);
  const res = await fetch(url, {
    method: 'DELETE',
  });
  console.log('[DeleteJob] response status →', res.status, res.statusText);
  if (!res.ok) {
    // ব্যাকএন্ডের error body-ও লগ করি (যেমন: {"message":"Job not found"})
    const body = await res.text().catch(() => '');
    console.error('[DeleteJob] failed →', res.status, body);
    throw new Error(`Failed to delete job (${res.status})`);
  }
  // কিছু ব্যাকএন্ড খালি body পাঠায় — সেক্ষেত্রে json() চেস্টা করে null
  const data = await res.json().catch(() => null);
  console.log('[DeleteJob] response body →', data);
  return data;
};
