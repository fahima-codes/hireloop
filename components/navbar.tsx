'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 👈 ১. Next.js Image কম্পোনেন্ট ইম্পোর্ট করা হলো
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

// better-auth থেকে inferred session type — 'any' ব্যবহারের দরকার নেই
type Session = typeof authClient.$Infer.Session;

const navLinks = [
  { label: 'Browse Jobs', href: '#', active: true },
  { label: 'Company', href: '#', active: false },
  { label: 'Pricing', href: '#', active: false },
];

function Logo() {
  return (
    <Link href="/" className="">
      {/* 👈 ২. আপনার পাবলিক ফোল্ডার থেকে লোগো ইমেজটি যোগ করা হলো */}
      <Image
        src="/images/logo.png" // আপনার ফাইলের নাম অনুযায়ী পরিবর্তন করতে পারেন (যেমন: logo.svg বা logo.jpg)
        alt="HireLoop Logo"
        width={100}
        height={100}
        className="object-contain"
      />
    </Link>
  );
}

const linkClass =
  'rounded-lg px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50';
const idleLinkClass = 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100';

function DesktopLinks({
  session,
  onSignOut,
}: {
  session: Session | null;
  onSignOut: () => void;
}) {
  return (
    <nav aria-label="Main" className="flex items-center gap-0.5">
      {navLinks.map(link => (
        <Link
          key={link.label}
          href={link.href}
          className={cn(
            linkClass,
            link.active ? 'font-medium text-zinc-50' : idleLinkClass,
          )}
        >
          {link.label}
        </Link>
      ))}
      <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-white/10" />

      {session?.user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-emerald-400 px-2">
            Welcome, {session.user.name}
          </span>
          <Button
            variant="ghost"
            onClick={onSignOut}
            className="h-8 rounded-lg border border-white/10 bg-white/ text-xs text-zinc-400 hover:bg-red-500/10 hover:text-red-400 px-3 transition-colors"
          >
            <LogOut className="size-3.5 mr-1" />
            Sign Out
          </Button>
        </div>
      ) : (
        <>
          <Link
            href="/sign-in"
            className={cn(linkClass, 'text-zinc-200 hover:text-zinc-50')}
          >
            Sign In
          </Link>
          <Link href="/sign-up">
            <Button className="ml-1 h-9 rounded-lg bg-indigo-500 px-4 text-white hover:bg-indigo-400">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
}

function MobileLinks({
  onNavigate,
  session,
  onSignOut,
}: {
  onNavigate: () => void;
  session: Session | null;
  onSignOut: () => void;
}) {
  return (
    <nav
      aria-label="Mobile"
      className="mx-4 mt-2 flex flex-col items-stretch gap-0.5 rounded-xl border border-white/10 bg-zinc-950 p-2 md:hidden"
    >
      {navLinks.map(link => (
        <Link
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            linkClass,
            link.active ? 'font-medium text-zinc-50' : idleLinkClass,
          )}
        >
          {link.label}
        </Link>
      ))}
      <span aria-hidden="true" className="my-1 h-px bg-white/10" />

      {session?.user ? (
        <div className="flex flex-col gap-2 p-2">
          <div className="text-sm font-medium text-emerald-400 text-center py-1.5 border border-emerald-500/10 bg-emerald-500/5 rounded-lg">
            Welcome, {session.user.name}
          </div>
          <Button
            onClick={() => {
              onSignOut();
              onNavigate();
            }}
            className="h-9 w-full rounded-lg bg-red-500/20 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/30"
          >
            <LogOut className="size-4 mr-1.5" />
            Sign Out
          </Button>
        </div>
      ) : (
        <>
          <Link
            href="/sign-in"
            onClick={onNavigate}
            className={cn(linkClass, 'text-zinc-200 hover:text-zinc-50')}
          >
            Sign In
          </Link>
          <Link href="/sign-up" onClick={onNavigate}>
            <Button className="mt-1 h-9 w-full rounded-lg bg-indigo-500 text-white hover:bg-indigo-400">
              Get Started
            </Button>
          </Link>
        </>
      )}
    </nav>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950 px-4 py-3 sm:px-6">
      <div className="relative flex items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/ p-1.5 pr-1.5 md:flex">
          <DesktopLinks session={session} onSignOut={handleSignOut} />
        </div>
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex size-9 items-center justify-center rounded-lg text-zinc-300 outline-none hover:bg-white/5 focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <MobileLinks
          onNavigate={() => setOpen(false)}
          session={session}
          onSignOut={handleSignOut}
        />
      )}
    </header>
  );
}
