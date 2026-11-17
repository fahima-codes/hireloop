// sidebar/menu-সংক্রান্ত শেয়ারড টাইপ — DashboardSidebar ব্যবহার করে

// auth-form.tsx-এর icon টাইপ প্যাটার্ন — lucide আইকন কম্পোনেন্ট
export type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};
