'use client';

// User Management — admin-এর সব user-এর তালিকা (/dashboard/admin/users)
// Figma: Admin/Manage Users — insight কার্ড + সার্চ/রোল ফিল্টার + ডাটা টেবিল
// ডাটা server page থেকে props-এ আসে — রোল/স্ট্যাটাস আপডেটের DB mutation পরে বসবে

import { useMemo, useState } from 'react';
import { BriefcaseBusiness, Download, Search, UserPlus, UserRound, UserRoundX } from 'lucide-react';

import { InsightCard } from '@/app/components/InsightCard';
import { RoleBadge } from '@/app/components/RoleBadge';
import { StatusPill } from '@/app/components/StatusPill';
import { UserRowActions } from './UserRowActions';
import { roleLabels, userRoles } from '@/lib/constants/users';
import { textFaint, textMuted, textPrimary } from '@/lib/constants/ui';
import type { ManagedUser, UserRole } from '@/lib/types/users';

type UsersManagementViewProps = {
  users: ManagedUser[];
};

type RoleFilter = UserRole | 'all';

const inputClass =
  'h-[38px] w-full rounded-xl border-white/10 bg-[#0c0c0f] text-sm text-[#ededef] focus-visible:border-white/20';

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const DAY_MS = 24 * 60 * 60 * 1000;

// "এখন" — render-এর ভেতরে Date.now() ডাকা যায় না (impure),
// তাই মডিউল লোডে একবারই হিসাব করে রাখি
const nowMs = Date.now();

export function UsersManagementView({ users }: UsersManagementViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  // সার্চ (name/email) + রোল ফিল্টার — ক্লায়েন্ট-সাইডেই বাছাই
  const filteredUsers = useMemo(
    () =>
      users.filter(user => {
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          user.email.toLowerCase().includes(query) ||
          user.name.toLowerCase().includes(query);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [users, searchQuery, roleFilter],
  );

  // Insight কার্ডের হিসাব — আসল user লিস্ট থেকেই (manage jobs-এর মতোই)
  const activeCount = users.filter(user => user.status === 'Active').length;
  const recruiterCount = users.filter(user => user.role === 'recruiter').length;
  const suspendedCount = users.filter(user => user.status === 'Suspended').length;
  const newSignupsCount = users.filter(
    user => nowMs - new Date(user.joinedAt).getTime() < DAY_MS,
  ).length;
  const suspendedShare = users.length
    ? `${((suspendedCount / users.length) * 100).toFixed(1)}% of total`
    : '—';

  // TODO: রোল/স্ট্যাটাস আপডেটের API কল এখানে বসবে — আপাতত শুধু ইভেন্ট লগ
  const handleRoleChange = (user: ManagedUser, next: UserRole) => {
    console.log('[Users] role change →', user.email, user.role, '→', next);
  };
  const handleToggleStatus = (user: ManagedUser) => {
    console.log('[Users] status toggle →', user.email, user.status);
  };
  const handleDelete = (user: ManagedUser) => {
    console.log('[Users] delete →', user.email);
  };
  // TODO: Export List — CSV তৈরি করে ডাউনলোড করার লজিক পরে যোগ হবে
  const handleExport = () => {
    console.log('[Users] export list →', filteredUsers.length, 'rows');
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* হেডার — টাইটেল + ডানপাশে Export List (Figma: সাদা বাটন) */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-semibold tracking-tight ${textPrimary}`}
          >
            User Management
          </h1>
          <p className={`mt-1 text-sm ${textMuted}`}>
            Review, filter, and manage platform access for all users.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#fafafa] px-4 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
        >
          <Download className="size-4" />
          Export List
        </button>
      </header>

      {/* Insight কার্ড — Figma-র ৪টা স্ট্যাট, আসল ডাটা থেকেই হিসাব */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard
          icon={<UserRound className="size-4" />}
          label="Total Active Users"
          value={activeCount.toLocaleString('en-US')}
          note="+12% vs last month"
          noteTone="positive"
        />
        <InsightCard
          icon={<BriefcaseBusiness className="size-4" />}
          label="Recruiter Growth"
          value={recruiterCount.toLocaleString('en-US')}
          note="High demand"
          noteTone="positive"
        />
        <InsightCard
          icon={<UserRoundX className="size-4" />}
          label="Suspended Accounts"
          value={suspendedCount.toLocaleString('en-US')}
          note={suspendedShare}
        />
        <InsightCard
          icon={<UserPlus className="size-4" />}
          label="New Signups (24h)"
          value={newSignupsCount.toLocaleString('en-US')}
          note="Steady activity"
        />
      </section>

      {/* ফিল্টার সেকশন — সার্চ (name/email) + রোল সিলেক্ট (manage jobs-এর প্যাটার্ন) */}
      <section className="mt-8 grid w-full gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-2">
        <div className="w-full lg:w-[262px]">
          {/* সার্চ ইনপুট — FilterSelect-এর লেবেল-কম compact ভার্সন */}
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#a0a0ab]" />
            {/* screen reader-দের জন্য লেবেল — ভিজ্যুয়াল লেবেল নেই */}
            <span className="sr-only">Search users</span>
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by email…"
              className={`${inputClass} pl-9`}
            />
          </label>
        </div>
        <div className="w-full lg:w-[262px]">
          <label className="sr-only" htmlFor="role-filter">
            Filter by role
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as RoleFilter)}
            className={inputClass}
          >
            <option value="all">All Roles</option>
            {userRoles.map(role => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ডাটা টেবিল — মোবাইলে হরিজন্টাল স্ক্রল (অন্য dashboard টেবিলের মতোই) */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#141418]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr
                className={`border-b border-white/10 bg-[#1a1a1f] text-xs ${textFaint}`}
              >
                <th className="px-4 py-3 font-medium">User Name</th>
                <th className="px-4 py-3 font-medium">Email Address</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Join Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`px-4 py-16 text-center text-sm ${textMuted}`}
                  >
                    {users.length === 0
                      ? 'No users on the platform yet.'
                      : 'No users match the current filters.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr
                    key={user._id}
                    className={`border-b border-white/10 last:border-0 transition-colors hover:bg-white/[0.03] ${
                      user.status === 'Suspended' ? 'opacity-60' : ''
                    }`}
                  >
                    {/* User — ইনিশিয়াল অ্যাভাটার (manage jobs-এর Company সেলের মতোই) */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-sm text-[#ededef]">
                          {user.name.charAt(0)}
                        </span>
                        <span className={`font-medium ${textPrimary}`}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${textMuted}`}>{user.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className={`px-4 py-3 ${textMuted}`}>
                      {user.joinedAt
                        ? dateFmt.format(new Date(user.joinedAt))
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={user.status} />
                    </td>
                    <td className="px-4 py-3">
                      <UserRowActions
                        user={user}
                        onRoleChange={handleRoleChange}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
