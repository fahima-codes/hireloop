// user-সংক্রান্ত শেয়ারড অপশন লিস্ট — admin users পেজের ফিল্টার/ব্যাজে ব্যবহৃত
// (jobs.ts / applications.ts-এর মতোই)

import type { UserStatus, UserRole } from '@/lib/types/users';

// ড্রপডাউন/ব্যাজে দেখানোর লেবেল — DB-তে role lowercase, UI-তে ক্যাপিটালাইজ করে দেখাই
export const userRoles: UserRole[] = ['seeker', 'recruiter', 'admin'];

export const roleLabels: Record<UserRole, string> = {
  seeker: 'Seeker',
  recruiter: 'Recruiter',
  admin: 'Admin',
};

export const userStatuses: UserStatus[] = ['Active', 'Suspended'];
