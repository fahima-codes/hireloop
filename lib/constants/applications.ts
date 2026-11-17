// application-সংক্রান্ত শেয়ারড অপশন লিস্ট — recruiter-এর status আপডেট ড্রপডাউন ও
// seeker-এর My Applications ট্যাব দুই জায়গাতেই ব্যবহৃত (jobs.ts-এর মতোই)

import type { ApplicationStatus } from '@/lib/types/applications';

// requirements.md-র status flow — Applied → Under Review → Shortlisted → Rejected/Offered
export const applicationStatuses: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Rejected',
  'Offered',
];
