import Image from 'next/image';
import { MapPin, Search } from 'lucide-react';

const trendingPositions = [
  'Product Designer',
  'AI Engineering',
  'DevOps Engineer',
];

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden bg-[#060609]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-15%] h-[420px] w-[560px] rounded-full bg-zinc-400/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-15%] h-[420px] w-[560px] rounded-full bg-zinc-400/10 blur-[120px]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-14 text-center sm:pt-16">
        <div className="flex w-full items-center justify-center gap-2">
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-r from-transparent to-white/20 sm:w-16"
          />
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <span aria-hidden>💼</span>
            <span className="text-sm font-bold text-white [text-shadow:0_0_10px_rgba(255,255,255,0.4)]">
              50,000+
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              New jobs this month
            </span>
          </span>
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-l from-transparent to-white/20 sm:w-16"
          />
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-[52px]">
          Find Your Dream Job Today
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        <form action="/" className="mt-9 w-full max-w-[640px]">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-2 transition-colors focus-within:border-white/20">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
              <Search className="size-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                name="q"
                type="text"
                placeholder="Job title, skill or company"
                aria-label="Job title, skill or company"
                className="w-full min-w-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <div
              aria-hidden
              className="hidden h-7 w-px shrink-0 bg-white/10 sm:block"
            />
            <div className="hidden min-w-0 items-center gap-2 px-2 sm:flex sm:w-48">
              <MapPin className="size-4 shrink-0 text-zinc-500" aria-hidden />
              <input
                name="location"
                type="text"
                placeholder="Location or Remote"
                aria-label="Location or Remote"
                className="w-full min-w-0 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              aria-label="Search jobs"
              className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500 text-white transition-colors hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <Search className="size-5" aria-hidden />
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[13px]">
          <span className="mr-1 text-zinc-500">Trending Position</span>
          {trendingPositions.map((position, index) => (
            <a
              key={position}
              href="#"
              className={
                index === 0
                  ? 'rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-950 transition-colors hover:bg-white'
                  : 'rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white'
              }
            >
              {position}
            </a>
          ))}
        </div>
      </section>

      {/* globe with starfield, rim glow and caption */}
      <section className="relative mt-2 w-full">
        <div className="relative aspect-[1440/1000] w-full">
          <Image
            src="/images/globe.png"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_61%]"
          />
          <p className="absolute inset-x-0 top-[44%] px-6 text-center text-[22px] leading-snug text-zinc-300 [text-shadow:0_0_16px_rgba(0,0,0,0.8)] sm:text-2xl md:text-[28px]">
            Assisting over{' '}
            <strong className="font-semibold text-white [text-shadow:0_0_14px_rgba(163,163,255,0.35)]">
              15,000 job seekers
            </strong>
            <br />
            <span className="text-zinc-400">find their dream positions.</span>
          </p>
        </div>
      </section>
    </main>
  );
}
