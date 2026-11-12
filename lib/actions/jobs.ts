// টাইপ এখন শেয়ারড জায়গায় — lib/types/jobs.ts থেকে রি-এক্সপোর্ট,
// তাই পুরনো import path (`@/lib/actions/jobs`) আগের মতোই কাজ করবে
export type { JobFormData } from '@/lib/types/jobs';
import type { JobFormData } from '@/lib/types/jobs';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const createJob = async (data: JobFormData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create job');
  }

  return res.json();
};
