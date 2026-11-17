// user-সংক্রান্ত টাইপের শেয়ারড সোর্স — sidebar, admin users পেজ সবাই এখান থেকে নেয়
// (jobs.ts / applications.ts-এর মতোই এক জায়গায় ডিক্লেয়ার — ডুপ্লিকেশন এড়াতে)

// better-auth-এর role additionalField — lib/auth.ts-এর user.additionalFields-এর সাথে মিলে
export type UserRole = 'seeker' | 'recruiter' | 'admin';

// অ্যাকাউন্ট স্ট্যাটাস — admin-এর suspend/activate ফিচারের জন্য
// TODO: backend-এ user suspend ফিল্ড যোগ হলে সেটা থেকেই আসবে
export type UserStatus = 'Active' | 'Suspended';

// admin-এর user management টেবিলের row — better-auth user doc + UI-র ডেরাইভ ফিল্ড
export type ManagedUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  // user doc-এর createdAt — ISO date string
  joinedAt: string;
  status: UserStatus;
};
