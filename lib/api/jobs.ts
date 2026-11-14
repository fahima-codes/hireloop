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

export const getJob = async (id: string): Promise<JobApiDoc | null> => {
  // ব্যাকএন্ডে আলাদা single-job endpoint নেই — query param দিয়ে filter করলে array আসে
  const res = await fetch(
    `${BASE_URL}/jobs?id=${encodeURIComponent(id)}`,
  );
  if (!res.ok) {
    throw new Error(`Failed to load job (${res.status})`);
  }
  const data = await res.json();
  // API বা তো সরাসরি array দেয়, নয়তো { jobs: [...] } ভেতরে — প্রথমটাই আমাদের job
  const jobs = Array.isArray(data) ? data : (data.jobs ?? []);
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
