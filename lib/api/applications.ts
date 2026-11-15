const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

import type { ApplicationApiDoc } from '@/lib/types/applications';

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
export const getApplicationsCount = async (
  userId = '',
): Promise<ApplicationApiDoc[]> => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${BASE_URL}/applications/count?${query}`);
  return res.json();
};
