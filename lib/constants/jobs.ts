// জব ফর্ম/ফিল্টারের শেয়ারড অপশন লিস্ট — new job ও manage jobs দুই পেজই ব্যবহার করে

import type { JobStatus } from '@/lib/types/jobs';

export const jobCategories = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Data & Analytics',
  'Human Resources',
  'Customer Support',
  'Other',
];

export const jobStatuses: JobStatus[] = ['Active', 'Closed'];

export const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];

export const salaryFrequencies = [
  'per hour',
  'per day',
  'per week',
  'per month',
  'per year',
];
