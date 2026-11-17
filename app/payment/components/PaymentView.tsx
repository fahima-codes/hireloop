'use client';

// Stripe Checkout sandbox-এর হুবহু ডিজাইন রেপ্লিকা — Pay বাটনের form জমা দিলে
// /api/checkout_sessions route-এ POST হয়, সেখান থেকে Stripe-এর hosted checkout-এ redirect হয়

import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

import { textFaint } from '@/lib/constants/ui';

// প্ল্যানের দাম — BDT/USD দুই কারেন্সিতে, Stripe sandbox-এর rate অনুযায়ী
const PRICES = {
  BDT: 'BDT 2,553.33',
  USD: '$20.00',
} as const;

type Currency = keyof typeof PRICES;

// country dropdown-এর কমন দেশগুলো — পরে Stripe-এর রেডি লিস্ট থেকে আসবে
const COUNTRIES = [
  'Bangladesh',
  'United States',
  'United Kingdom',
  'India',
  'Canada',
  'Australia',
];

// ইনপুটের শেয়ারড স্টাইল — Stripe-এর সাদা bordered ফিল্ড, ফোকাসে Stripe নীল
const inputClass =
  'h-10 w-full rounded-md border border-[#e0e0e5] bg-white px-3 text-sm text-[#1a1a1e] placeholder:text-[#a0a0ab] outline-none transition-colors focus:border-[#0570de]';

// uppercase ছোট লেবেল — CARD INFORMATION / CARDHOLDER NAME / COUNTRY OR REGION
const fieldLabelClass =
  'text-[10px] font-medium uppercase tracking-wider text-[#6e6e78]';

// কার্ড নম্বরে ৪ ডিজিট পর পর স্পেস, সর্বোচ্চ ১৬ ডিজিট
const formatCardNumber = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

// MM/YY ফরম্যাট — ২ ডিজিটের পরে স্ল্যাশ বসে
const formatExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
};

// CVC — সর্বোচ্চ ৪ ডিজিট
const formatCvc = (raw: string) => raw.replace(/\D/g, '').slice(0, 4);

export default function PaymentView({
  canceled,
  jobId,
}: {
  canceled?: string;
  jobId?: string;
}) {
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholder, setCardholder] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [saveInfo, setSaveInfo] = useState(true);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* ব্রেডক্রাম — job details পেজের "Public / Job Details" স্টাইলেই */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-xs ${textFaint}`}
      >
        <Link href="/" className="transition-colors hover:text-zinc-300">
          Public
        </Link>
        <span aria-hidden>/</span>
        <span>Checkout — Stripe Payment</span>
      </nav>

      {/* cancel_url থেকে ফিরে এলে user-কে জানানো হয় payment বাতিল হয়েছে */}
      {canceled && (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Your checkout was canceled — you can pay whenever you&apos;re ready.
        </div>
      )}

      {/* ---------- Checkout কার্ড ---------- */}
      <section className="mt-3 overflow-hidden rounded-xl shadow-2xl">
        <div className="md:grid md:grid-cols-[2fr_3fr]">
          {/* বাম প্যানেল — কারেন্সি + প্ল্যান সামারি */}
          <div className="bg-[#f6f6f7] p-6 text-[#1a1a1e]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Go back"
                className="grid size-8 place-items-center rounded-md border border-[#e0e0e5] bg-white text-[#1a1a1e] shadow-sm transition-colors hover:bg-[#fafafa]"
              >
                <ArrowLeft className="size-4" />
              </button>
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-md border border-[#e0e0e5] bg-white shadow-sm"
              >
                <Lock className="size-4" />
              </span>
            </div>

            <p className="mt-6 text-[11px] font-medium tracking-wider text-[#6e6e78]">
              CHOOSE A CURRENCY:
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(Object.keys(PRICES) as Currency[]).map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurrency(code)}
                  className={
                    `flex h-11 items-center gap-2 rounded-md border bg-white px-3 text-sm font-medium transition-shadow ` +
                    (currency === code
                      ? 'border-[#1a1a1e] text-[#1a1a1e] shadow-md'
                      : 'border-[#e0e0e5] text-[#a0a0ab] shadow-sm hover:border-[#c4c7c8]')
                  }
                >
                  <span aria-hidden>{code === 'BDT' ? '🇧🇩' : '🇺🇸'}</span>
                  {PRICES[code]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[#6e6e78]">
              1 USD = 127.6665 BDT
            </p>

            <div className="mt-5 border-t border-[#e6e6e9] pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-semibold">Hireloop Pro Plan</p>
                  <p className="mt-0.5 text-xs text-[#6e6e78]">
                    Access to all features
                  </p>
                </div>
                <p className="text-[15px] font-semibold">{PRICES[currency]}</p>
              </div>
            </div>
          </div>

          {/* ডান প্যানেল — payment form */}
          <div className="relative bg-white p-6 text-[#1a1a1e]">
            <span className="absolute right-6 top-6 rounded bg-[#2f2f35] px-2 py-1 text-[10px] font-medium tracking-[0.08em] text-white">
              SANDBOX
            </span>

            {/* Link বাটন — Stripe-এর one-click payment */}
            <button
              type="button"
              className="relative flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#00d66f] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00c766]"
            >
              <span
                aria-hidden
                className="grid size-4 place-items-center rounded-full bg-white text-[10px] font-black text-[#00d66f]"
              >
                l
              </span>
              link
              <span className="absolute right-2.5 flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#1a1a1e]">
                VISA
                <span className="font-normal text-[#6e6e78]">4242</span>
              </span>
            </button>

            {/* OR divider */}
            <div className="mt-4 flex items-center gap-4">
              <span aria-hidden className="h-px flex-1 bg-[#e6e6e9]" />
              <span className="text-[11px] text-[#6e6e78]">OR</span>
              <span aria-hidden className="h-px flex-1 bg-[#e6e6e9]" />
            </div>

            {/* Contact information */}
            <p className="mt-4 text-[13px] font-medium">Contact information</p>
            <input
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className={`${inputClass} mt-2`}
            />

            {/* Payment method — Card accordion */}
            <p className="mt-5 text-[13px] font-medium">Payment method</p>
            <div className="mt-2 overflow-hidden rounded-md border border-[#e0e0e5]">
              <div className="flex items-center gap-2 px-3 py-2.5 text-sm">
                <CreditCard className="size-4 text-[#6e6e78]" aria-hidden />
                Card
              </div>
              <div className="border-t border-[#e0e0e5] px-3 pb-3 pt-3">
                <p className={fieldLabelClass}>Card information</p>
                <div className="mt-1.5 divide-y divide-[#e0e0e5] rounded-md border border-[#e0e0e5]">
                  <div className="relative">
                    <input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 1234 1234 1234"
                      value={cardNumber}
                      onChange={event =>
                        setCardNumber(formatCardNumber(event.target.value))
                      }
                      className={`${inputClass} rounded-none border-0 pr-16`}
                    />
                    <span
                      aria-hidden
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[#c4c7c8]"
                    >
                      <CreditCard className="size-4" />
                      <CreditCard className="size-4" />
                    </span>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#e0e0e5]">
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM / YY"
                      value={expiry}
                      onChange={event =>
                        setExpiry(formatExpiry(event.target.value))
                      }
                      className={`${inputClass} rounded-none border-0`}
                    />
                    <div className="relative">
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVC"
                        value={cvc}
                        onChange={event =>
                          setCvc(formatCvc(event.target.value))
                        }
                        className={`${inputClass} rounded-none border-0 pr-8`}
                      />
                      <CircleHelp
                        aria-hidden
                        className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#c4c7c8]"
                      />
                    </div>
                  </div>
                </div>

                <p className={`${fieldLabelClass} mt-3`}>Cardholder name</p>
                <input
                  autoComplete="cc-name"
                  placeholder="Full name on card"
                  value={cardholder}
                  onChange={event => setCardholder(event.target.value)}
                  className={`${inputClass} mt-1.5`}
                />

                <p className={`${fieldLabelClass} mt-3`}>Country or region</p>
                <div className="relative mt-1.5">
                  <select
                    value={country}
                    onChange={event => setCountry(event.target.value)}
                    className={`${inputClass} appearance-none pr-9`}
                  >
                    {COUNTRIES.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a0a0ab]"
                  />
                </div>
              </div>
            </div>

            {/* Save info checkbox */}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-[#e0e0e5] px-3 py-3">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={event => setSaveInfo(event.target.checked)}
                className="mt-0.5 size-4 accent-[#0570de]"
              />
              <span>
                <span className="block text-[13px]">
                  Save my information for faster checkout
                </span>
                <span className="mt-0.5 block text-[11px] text-[#6e6e78]">
                  Pay securely on this site and everywhere Link is accepted.
                </span>
              </span>
            </label>

            {/* Stripe Checkout — form submit করলে /api/checkout_sessions POST হয়,
                route handler 303 redirect-এ Stripe-এর hosted checkout page-এ পাঠিয়ে দেয়
                jobId — কোন job-এর জন্য pay করা হচ্ছে; success_url-এ এটাই বহন হয় */}
            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="currency" value={currency} />
              {jobId && <input type="hidden" name="jobId" value={jobId} />}
              <button
                type="submit"
                role="link"
                className="mt-4 h-11 w-full rounded-md bg-[#0570de] text-sm font-medium text-white transition-colors hover:bg-[#0668cc]"
              >
                Pay
              </button>
            </form>
          </div>
        </div>

        {/* কার্ডের ফুটার — Stripe branding */}
        <footer className="bg-[#f6f6f7] px-6 py-5 text-center">
          <p className="text-xs text-[#6e6e78]">Powered by Stripe</p>
          <p className="mt-2 text-[11px] text-[#6e6e78]">
            <a href="#" className="transition-colors hover:text-[#1a1a1e]">
              Terms
            </a>
            <span aria-hidden className="mx-3" />
            <a href="#" className="transition-colors hover:text-[#1a1a1e]">
              Privacy
            </a>
          </p>
        </footer>
      </section>
    </div>
  );
}
