const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// MongoDB-র raw document — JobFormData + API-র _id ও ঐচ্ছিক মেটাডাটা
export type JobApiDoc = {
  _id: string;
  title: string;
  company: string;
  category: string;
  jobType: string;
  remoteAllowed: boolean;
  location: string;
  deadline: string;
  salaryMin: string;
  salaryMax: string;
  frequency: string;
  responsibilities: string;
  requirements: string;
  ref?: string;
  status?: string;
  postedAt?: string;
  applicants?: number;
  views?: number;
};

export const getJobs = async (): Promise<JobApiDoc[]> => {
  const res = await fetch(`${BASE_URL}/jobs`);
  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`);
  }
  const data = await res.json();
  // API বা তো সরাসরি array দেয়, নয়তো { jobs: [...] } ভেতরে
  return Array.isArray(data) ? data : (data.jobs ?? []);
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
