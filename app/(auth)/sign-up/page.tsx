'use client';
import { authClient } from '@/lib/auth-client';
import { AuthForm } from '../auth-form';

// ইন্টারফেসের নাম পরিবর্তন করে AuthFormData করা হলো যাতে কম্পোনেন্টের নামের সাথে না মিলে যায়
interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const handleSignUp = async (data: AuthFormData) => {
    const { data: signUpResponse, error } = await authClient.signUp.email({
      name: data.name || '',
      email: data.email,
      password: data.password,
      callbackURL: '/',
    });

    console.log('sign up response', signUpResponse, error);
  };

  // এখানে onSubmit প্রপস হিসেবে handleSignUp ফাংশনটি পাঠানো হচ্ছে
  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />;
}
