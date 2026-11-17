const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

import type {
  ApplicationApiDoc,
  ApplicationStatus,
} from '@/lib/types/applications';

// টাইপ এখন শেয়ারড জায়গায় — lib/types/applications.ts থেকে রি-এক্সপোর্ট
export type { ApplicationApiDoc } from '@/lib/types/applications';

export const getApplications = async (
  userId = '',
): Promise<ApplicationApiDoc[]> => {
  // userId দিলে শুধু ওই user-এর application — backend ?userId= param filter করে
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${BASE_URL}/applications${query}`);
  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`);
  }
  const data = await res.json();
  // API বা তো সরাসরি array দেয়, নয়তো { applications: [...] } ভেতরে
  return Array.isArray(data) ? data : (data.applications ?? []);
};
// নির্দিষ্ট একটা job-এর সব application — recruiter-এর job applications পেজের জন্য
export const getApplicationsByJob = async (
  jobId: string,
): Promise<ApplicationApiDoc[]> => {  // ব্যাকএন্ডের GET /applications শুধু ?userId= filter করে — jobId query param
  // support করে না, তাই পুরো list এনে এখানেই job অনুযায়ী বাছাই করে নিই
  const res = await fetch(`${BASE_URL}/applications`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load applications (${res.status})`);
  }
  const data = await res.json();
  const all = Array.isArray(data) ? data : (data.applications ?? []);
  return all.filter(
    (app: ApplicationApiDoc) => String(app.jobId) === String(jobId),
  );
};

export const getApplicationsCount = async (
  userId = '',
): Promise<{ count: number }> => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${BASE_URL}/applications/count?${query}`);
  return res.json();
};

// recruiter-এর status আপডেট — ব্যাকএন্ডের PATCH /applications/:id ডাকে,
// Mongo-র updateOne দিয়ে শুধু status ফিল্ড বদলায়
export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update application status (${res.status})`);
  }
};
