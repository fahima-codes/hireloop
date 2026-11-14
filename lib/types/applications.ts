// অ্যাপ্লিকেশন-সংক্রান্ত সব টাইপের শেয়ারড সোর্স — actions/pages সবাই এখান থেকে নেয়
// (jobs.ts-এর মতোই এক জায়গায় ডিক্লেয়ার — একাধিক জায়গায় ডুপ্লিকেশন এড়াতে)

// Project requirements.md-এর status flow — Applied → Under Review → Shortlisted → Rejected/Offered
export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Rejected'
  | 'Offered';

// Apply করার সময় ডাটাবেসে পাঠানো ফিল্ড — job details পেজের job doc + session user থেকে আসে
// My Applications (seeker) ও Applications (recruiter) টেবিলে এই ফিল্ডগুলোই দেখানো হয়,
// তাই job/user সংক্রান্ত তথ্য denormalize করে রাখা হয় — পরে job এডিট/ডিলিট হলেও row-টা অক্ষত থাকে
export type ApplicationFormData = {
  // কোন job-এ apply — View Details বাটনের লিংকেও লাগবে
  jobId: string;
  jobTitle: string;
  company: string;
  category: string;
  jobType: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  // কে apply করেছে — session user থেকে
  userId: string;
  name: string;
  email: string;
  // requirements.md-র recruiter ভিউতে Resume link কলাম আছে — resume upload যোগ হলে পাঠানো হবে
  resumeLink?: string;
  // apply-এর মুহূর্তে সেট হয় — পরে recruiter status আপডেট করবে
  status: ApplicationStatus;
  appliedAt: string;
};

// MongoDB-র raw document — ApplicationFormData + API-র _id
export type ApplicationApiDoc = ApplicationFormData & {
  _id: string;
};
