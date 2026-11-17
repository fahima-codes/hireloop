import { headers } from 'next/headers';
import { auth } from './auth';

export { cn } from 'cn';

// admin plugin-এর listUsers — সব user-এর তালিকা, name অনুযায়ী সাজানো
// (admin user management টেবিলের ডাটা) — এই endpoint-এ session cookie লাগে
export const getUsers = async () => {
  const { users } = await auth.api.listUsers({
    query: {
      sortBy: 'name', // The field to sort by.
      sortDirection: 'asc',
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });
  return users;
};
