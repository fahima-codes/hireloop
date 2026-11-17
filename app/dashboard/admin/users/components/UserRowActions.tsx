'use client';

// User management টেবিলের Actions কলাম — প্রতি row-তে রোল বদলানোর বাটন
// (Make Recruiter / Make Seeker / Make Admin — যেগুলো বর্তমান রোল নয়) +
// Suspend/Activate টগল + Delete
// TODO: রোল/স্ট্যাটাস আপডেটের DB mutation এখানকার callback-গুলোতেই বসবে —
// আপাতত শুধু ইভেন্ট ধরা হচ্ছে (handler-গুলো page-এ পাস হয়)

import { userRoles, roleLabels } from '@/lib/constants/users';
import type { ManagedUser, UserRole } from '@/lib/types/users';

type UserRowActionsProps = {
  user: ManagedUser;
  onRoleChange: (user: ManagedUser, next: UserRole) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDelete: (user: ManagedUser) => void;
};

// টেক্সট লিংক স্টাইলের অ্যাকশন — Figma-র মতো ছোট হালকা বাটন
const actionClass =
  'text-xs font-medium transition-colors hover:underline underline-offset-2';
const neutralActionClass = `${actionClass} text-[#c4c7c8] hover:text-white`;
const dangerActionClass = `${actionClass} text-[#ef4444]/80 hover:text-[#ef4444]`;

export function UserRowActions({
  user,
  onRoleChange,
  onToggleStatus,
  onDelete,
}: UserRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      {/* বর্তমান রোল ছাড়া বাকি রোলগুলোর Make বাটন — toggleable */}
      {userRoles
        .filter(role => role !== user.role)
        .map(role => (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(user, role)}
            className={neutralActionClass}
          >
            Make {roleLabels[role]}
          </button>
        ))}

      {/* Suspend/Activate টগল — বর্তমান স্ট্যাটাসের উল্টোটা দেখায় */}
      <button
        type="button"
        onClick={() => onToggleStatus(user)}
        className={
          user.status === 'Active' ? dangerActionClass : neutralActionClass
        }
      >
        {user.status === 'Active' ? 'Suspend' : 'Activate'}
      </button>

      <button
        type="button"
        onClick={() => onDelete(user)}
        className={dangerActionClass}
      >
        Delete
      </button>
    </div>
  );
}
