import type { Metadata } from 'next';

import { UsersManagementView } from './components/UsersManagementView';
import { getUsers } from '@/lib/utils';
import type { ManagedUser, UserRole } from '@/lib/types/users';

// page-এ session cookie দরকার (better-auth listUsers) — প্রতি request-এ চলে,
// তাই listing পেজের মতোই instant-navigation validation opt-out
export const instant = false;

export const metadata: Metadata = {
  title: 'User Management — HireLoop',
};

// better-auth-র user doc-এর টাইপ — getUsers-এর return type থেকেই infer
type AdminUserDoc = Awaited<ReturnType<typeof getUsers>>[number];

// better-auth user doc → admin টেবিলের row — manage jobs-এর toManagedJob-এর মতোই mapper
function toManagedUser(doc: AdminUserDoc): ManagedUser {
  return {
    _id: doc.id,
    name: doc.name,
    email: doc.email,
    role: doc.role as UserRole,
    // createdAt ISO string — টেবিলে Join Date হিসেবে দেখানো হয়
    joinedAt: new Date(doc.createdAt).toISOString(),
    // TODO: backend-এ user suspend ফিল্ড যোগ হলে সেখান থেকে আসবে
    status: 'Active',
  };
}

const AdminUsersPage = async () => {
  const users = await getUsers();

  return <UsersManagementView users={users.map(toManagedUser)} />;
};

export default AdminUsersPage;
