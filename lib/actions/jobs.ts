// Type ta ekhanei rakho, page.tsx theke import kora lagbe na
export type JobFormData = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  remoteAllowed: boolean;
  // tomar form e ja ja ase, eikhane add koro
};

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
