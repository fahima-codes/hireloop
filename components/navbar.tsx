'use client';

import { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { cn } from 'cn';

import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Browse Jobs', href: '#', active: true },
  { label: 'Company', href: '#', active: false },
  { label: 'Pricing', href: '#', active: false },
];

function Logo() {
  return (
    <a
      href="#"
      className="flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="text-lg font-bold leading-none tracking-tight">
        <span className="text-sky-400">hire</span>
        <span className="text-orange-500">l</span>
        {/* Globe stands in for the second "o" of "loop" */}
        <Globe
          aria-hidden="true"
          className="mx-px inline-block size-[18px] translate-y-0.5 text-sky-400"
          strokeWidth={2.5}
        />
        <span className="text-orange-500">p</span>
      </span>
    </a>
  );
}

const linkClass =
  'rounded-lg px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50';
const idleLinkClass = 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100';

function DesktopLinks() {
  return (
    <nav aria-label="Main" className="flex items-center gap-0.5">
      {navLinks.map(link => (
        <a
          key={link.label}
          href={link.href}
          className={cn(
            linkClass,
            link.active ? 'font-medium text-zinc-50' : idleLinkClass,
          )}
        >
          {link.label}
        </a>
      ))}
      <span aria-hidden="true" className="mx-1.5 h-5 w-px bg-white/10" />
      <a href="#" className={cn(linkClass, 'text-zinc-200 hover:text-zinc-50')}>
        Sign In
      </a>
      <Button className="ml-1 h-9 rounded-lg bg-indigo-500 px-4 text-white hover:bg-indigo-400">
        Get Started
      </Button>
    </nav>
  );
}

function MobileLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav
      aria-label="Mobile"
      className="mx-4 mt-2 flex flex-col items-stretch gap-0.5 rounded-xl border border-white/10 bg-zinc-950 p-2 md:hidden"
    >
      {navLinks.map(link => (
        <a
          key={link.label}
          href={link.href}
          onClick={onNavigate}
          className={cn(
            linkClass,
            link.active ? 'font-medium text-zinc-50' : idleLinkClass,
          )}
        >
          {link.label}
        </a>
      ))}
      <span aria-hidden="true" className="my-1 h-px bg-white/10" />
      <a
        href="#"
        onClick={onNavigate}
        className={cn(linkClass, 'text-zinc-200 hover:text-zinc-50')}
      >
        Sign In
      </a>
      <Button
        onClick={onNavigate}
        className="mt-1 h-9 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400"
      >
        Get Started
      </Button>
    </nav>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950 px-4 py-3 sm:px-6">
      <div className="relative flex items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 pr-1.5 md:flex">
          <DesktopLinks />
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
      {open && <MobileLinks onNavigate={() => setOpen(false)} />}
    </header>
  );
}
