import type { auth } from '@/lib/auth';
import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
// type-only import: server কোড client bundle-এ যাবে না, শুধু field-গুলোর type আসবে

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
