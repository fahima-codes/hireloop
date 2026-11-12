// জব-সংক্রান্ত সব টাইপের শেয়ারড সোর্স — api/actions/pages সবাই এখান থেকে নেয়
// (আগে JobFormData তিন জায়গায় আলাদা করে ডিক্লেয়ার ছিল — এক জায়গায় এনে ডুপ্লিকেশন কমানো হলো)

export type JobStatus = 'Active' | 'Closed';

// ফর্ম থেকে পাঠানো ফিল্ড — create job ও manage jobs দুই জায়গাতেই ব্যবহৃত
export type JobFormData = {
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
};

// MongoDB-র raw document — JobFormData + API-র _id ও ঐচ্ছিক মেটাডাটা
// নতুন তৈরি job-এ status/postedAt/applicants থাকে না
export type JobApiDoc = JobFormData & {
  _id: string;
  ref?: string;
  status?: string;
  postedAt?: string;
  applicants?: number;
  views?: number;
};

// টেবিলে দরকারি ডেরাইভ করা মেটাডাটাসহ row
export type ManagedJob = JobFormData & {
  _id: string;
  ref: string;
  status: JobStatus;
  postedAt: string;
  applicants: number;
  views: number;
};
