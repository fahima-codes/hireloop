'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Building2, Code, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AuthMode = 'sign-in' | 'sign-up';

export type UserRole = 'seeker' | 'recruiter' | 'admin';

type FormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

// প্রপসের টাইপ ঠিক করা হলো যাতে onSubmit ফাংশনটি গ্রহণ করা যায়
type AuthFormProps = {
  mode: AuthMode;
  onSubmit?: (data: FormData) => void | Promise<void>;
};

const modes: { value: AuthMode; label: string; href: string }[] = [
  { value: 'sign-in', label: 'Sign In', href: '/sign-in' },
  { value: 'sign-up', label: 'Sign Up', href: '/sign-up' },
];

const inputClass =
  'h-10 rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-white/20';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-zinc-400';

const roleOptions: {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'seeker',
    label: 'Job Seeker',
    description: 'Find and apply to jobs',
    icon: Briefcase,
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Hire top talent',
    icon: Building2,
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Manage the platform',
    icon: ShieldCheck,
  },
];

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  // 👈 এখানে onSubmit রিসিভ করা হলো
  const router = useRouter();
  const isSignUp = mode === 'sign-up';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
  });

  // submit চলাকালীন button disable করে duplicate request আটকায়
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return; // চলমান submit থাকলে আবার চলবে না

    // 👈 যদি SignUpPage থেকে onSubmit ফাংশন পাঠানো হয়ে থাকে, তবে বর্তমান ফর্মের ডেটা সহ সেটি কল হবে
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log(isSignUp ? 'sign-up data' : 'sign-in data', formData);
    }
  };

  const switchMode = (href: string) => router.push(href);

  return (
    <main className="relative flex-1 overflow-hidden bg-[#060609]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[50%] h-[420px] w-[560px] -translate-x-1/2 rounded-full bg-zinc-400/10 blur-[120px]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center px-6 pt-14 sm:pt-20">
        {/* Toggle between sign in / sign up */}
        <div className="flex w-full items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          {modes.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => switchMode(m.href)}
              aria-current={mode === m.value}
              className={
                m.value === mode
                  ? 'w-full rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-zinc-50 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50'
                  : 'w-full rounded-lg px-4 py-1.5 text-sm text-zinc-400 outline-none transition-colors hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-3 focus-visible:ring-ring/50'
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-white">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          {isSignUp
            ? 'Join HireLoop and find your dream role.'
            : 'Sign in to continue your job search.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 w-full">
          <div className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                {!isSignUp && (
                  <a
                    href="#"
                    className="mb-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={isSignUp ? 8 : undefined}
                className={inputClass}
              />
            </div>

            {isSignUp && (
              <div>
                <span id="role-label" className={labelClass}>
                  I am a
                </span>
                <div
                  role="radiogroup"
                  aria-labelledby="role-label"
                  className="grid grid-cols-3 gap-2"
                >
                  {roleOptions.map(option => {
                    const Icon = option.icon;
                    const selected = formData.role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            role: option.value,
                          }))
                        }
                        className={
                          selected
                            ? 'flex flex-col items-center gap-1 rounded-xl border border-indigo-500/50 bg-indigo-500/15 px-2 py-3 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50'
                            : 'flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-3 outline-none transition-colors hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/50'
                        }
                      >
                        <Icon
                          className={
                            selected
                              ? 'size-4 text-indigo-400'
                              : 'size-4 text-zinc-500'
                          }
                        />
                        <span
                          className={
                            selected
                              ? 'text-xs font-medium text-zinc-100'
                              : 'text-xs text-zinc-400'
                          }
                        >
                          {option.label}
                        </span>
                        <span className="text-center text-[10px] leading-tight text-zinc-500">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-10 w-full rounded-xl bg-indigo-500 text-sm text-white hover:bg-indigo-400"
          >
            {isSubmitting
              ? isSignUp
                ? 'Creating account…'
                : 'Signing in…'
              : isSignUp
                ? 'Create Account'
                : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 flex w-full items-center gap-3">
          <span aria-hidden className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            or continue with
          </span>
          <span aria-hidden className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-200 hover:bg-white/10"
          >
            <Mail className="size-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-white/10 bg-white/[0.04] text-sm text-zinc-200 hover:bg-white/10"
          >
            <Code className="size-4" />
            GitHub
          </Button>
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => switchMode(isSignUp ? '/sign-in' : '/sign-up')}
            className="font-medium text-indigo-400 outline-none transition-colors hover:text-indigo-300 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </section>
    </main>
  );
}
