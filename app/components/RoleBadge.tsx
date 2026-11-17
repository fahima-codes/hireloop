// রোল ব্যাজ — admin-এর user management টেবিলের Role কলামে ব্যবহৃত
// DB-তে role lowercase ('seeker' | 'recruiter' | 'admin'), UI-তে ক্যাপিটালাইজ করে দেখাই

import { BriefcaseBusiness, ShieldCheck, User } from 'lucide-react';

import { roleLabels } from '@/lib/constants/users';
import type { UserRole } from '@/lib/types/users';

// প্রতিটা রোলের আইকন + রঙ — border/background/text একই hue-র হালকা ভার্সন
const roleMeta: Record<
  UserRole,
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  seeker: {
    icon: User,
    className: 'border-white/10 bg-[#1a1a1f] text-[#c4c7c8]',
  },
  recruiter: {
    icon: BriefcaseBusiness,
    className: 'border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#60a5fa]',
  },
  admin: {
    icon: ShieldCheck,
    className: 'border-[#a855f7]/30 bg-[#a855f7]/15 text-[#c084fc]',
  },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const { icon: Icon, className } = roleMeta[role];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="size-3" />
      {roleLabels[role]}
    </span>
  );
}
