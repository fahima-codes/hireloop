// টাইপ এখন শেয়ারড জায়গায় — lib/types/applications.ts থেকে রি-এক্সপোর্ট
export type { ApplicationFormData } from '@/lib/types/applications';
import type { ApplicationFormData } from '@/lib/types/applications';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function applyToAJob(data: ApplicationFormData) {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit application (${response.status})`);
  }

  return response.json();
}
