'use client'; // 👈 ১. ক্লায়েন্ট কম্পোনেন্ট ডিরেক্টরি যুক্ত করা হলো

import { authClient } from '@/lib/auth-client';
import { AuthForm } from '../auth-form'; // 👈 ২. সঠিক ইম্পোর্ট পাথ
import { useSearchParams } from 'next/navigation';

// ৩. এখানেই ফর্মের ডেটা টাইপটি ডিফাইন করে দেওয়া হলো
interface AuthFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';
  console.log('redirectTo', redirectTo);
  const handleSignIn = async (data: AuthFormData) => {
    const { data: signInResponse, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: redirectTo,
    });

    console.log('signIn response', signInResponse, error);
  };

  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />;
}
