import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { BadgeCheck, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

import type Stripe from 'stripe';

import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getJobById } from '@/lib/api/jobs';
import { getApplications } from '@/lib/api/applications';
import { applyToAJob } from '@/lib/actions/applications';
import CopyButton from '@/app/components/CopyButton';
import type { ApplicationFormData } from '@/lib/types/applications';
import { textMuted, textPrimary } from '@/lib/constants/ui';
import { checkoutVerify } from '@/lib/actions/payments';

// success_url-এ Stripe নিজেই ?session_id=... append করে — এটা দিয়ে checkout session
// retrieve করে transaction id / status / customer email সব details বের করা যায়

// console-এ দেখানোর জন্য প্রয়োজনীয় transaction details
type TransactionDetails = {
  transactionId: string | null;
  paymentIntentId: string | null;
  sessionStatus: string | null;
  paymentStatus: string | null;
  customerEmail: string | null;
  amountPaid: string | null;
  currency: string | null;
  createdAt: string | null;
};

// Stripe checkout সফল হলে success_url হিসেবে এখানে ফেরত আসে
// jobId সহ এলে (job details → Apply → checkout ফ্লো) এখানেই সেই job-এ application submit হয়
// প্রতি request-এ session user / job / Stripe session fetch হয় — তাই prerender block করতে হয়
export const instant = false;

export const metadata: Metadata = {
  title: 'Payment Successful — HireLoop',
};

const PaymentSuccessPage = async ({
  searchParams,
}: {
  // searchParams একটা Promise — await করে বের করতে হয় (sync access করলে Next error দেয়)
  // session_id — Stripe নিজেই success_url-এ append করে দেয়
  searchParams: Promise<{ jobId?: string; session_id?: string }>;
}) => {
  // searchParams একটা Promise — await করে বের করতে হয় (sync access করলে Next error দেয়)
  // session_id — Stripe নিজেই success_url-এ append করে দেয়
  const { jobId, session_id: sessionId } = await searchParams;

  // logged-in user — checkout-verify-তে userId পাঠাতে আর pay-to-apply-তে দুই জায়গায় লাগে
  const session = await auth.api.getSession({ headers: await headers() });

  // Stripe থেকে checkout session retrieve করে transaction details console-এ log করি
  let transaction: TransactionDetails | null = null;

  if (sessionId) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          // payment_intent = আসল transaction; customer expand করলে email address-ও পাওয়া যায়
          expand: ['payment_intent', 'customer'],
        },
      );

      const paymentIntent =
        checkoutSession.payment_intent as Stripe.PaymentIntent | null;
      const customer = checkoutSession.customer as Stripe.Customer | null;

      transaction = {
        transactionId: checkoutSession.id,
        paymentIntentId: paymentIntent?.id ?? null,
        sessionStatus: checkoutSession.status,
        paymentStatus: checkoutSession.payment_status,
        customerEmail:
          checkoutSession.customer_details?.email ?? customer?.email ?? null,
        amountPaid:
          checkoutSession.amount_total != null
            ? (checkoutSession.amount_total / 100).toFixed(2)
            : null,
        currency: checkoutSession.currency?.toUpperCase() ?? null,
        // receipt-এ readable format-এ দেখাই — UTC ধরে রাখি যাতে server/client-এ একই দেখায়
        createdAt: checkoutSession.created
          ? new Date(checkoutSession.created * 1000).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'UTC',
            })
          : null,
      };

      // server console (terminal) — user চাইলে payment-এর সব details এখানে দেখবে
      console.log('════════ Stripe payment details ════════');
      console.log('Transaction ID   :', transaction.transactionId);
      console.log('Payment Intent ID:', transaction.paymentIntentId);
      console.log('Session status   :', transaction.sessionStatus);
      console.log('Payment status   :', transaction.paymentStatus);
      console.log('Customer email   :', transaction.customerEmail);
      console.log(
        `Amount           : ${transaction.amountPaid} ${transaction.currency}`,
      );
      console.log('Paid at          :', transaction.createdAt);
      console.log('──────── Full session object ────────');
      console.log(JSON.stringify(checkoutSession, null, 2));
      console.log('════════════════════════════════════════');

      // backend verify — session id + logged-in user id দিয়ে backend নিজে Stripe-এ যাচাই করবে
      try {
        const result = await checkoutVerify(sessionId, session?.user?.id);
        console.log('[PaymentSuccess] checkout-verify result —', result);
      } catch (e) {
        console.error('[PaymentSuccess] checkout-verify failed —', e);
      }
    } catch (e) {
      console.error('[PaymentSuccess] session retrieve failed —', e);
    }
  } else {
    console.log(
      '[PaymentSuccess] session_id নেই — Stripe checkout ছাড়া success পেজে এসেছে',
    );
  }

  // pay-to-apply — payment-এর সাথে job context থাকলে অটো apply
  let appliedJobTitle: string | null = null;
  let applyError: 'auth' | 'job' | 'submit' | null = null;

  if (jobId) {
    // job doc — session উপরেই আনা হয়েছে
    const job = await getJobById(jobId);

    if (session?.user?.role === 'seeker' && job) {
      const user = session.user;

      // duplicate apply আটকাই — Stripe-এ refresh/back করলে পেজটা আবার রেন্ডার হয়
      const applications = await getApplications(user.id).catch(() => null);
      const alreadyApplied =
        applications?.some(a => a.jobId === job._id) ?? false;

      if (alreadyApplied) {
        appliedJobTitle = job.title;
      } else {
        const application: ApplicationFormData = {
          jobId: job._id,
          jobTitle: job.title,
          company: job.company,
          category: job.category,
          jobType: job.jobType,
          
          location: job.location,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          userId: user.id,
          name: user.name,
          email: user.email,
          // requirements.md-র status flow-র শুরু — পরে recruiter আপডেট করবে
          status: 'Applied',
          appliedAt: new Date().toISOString(),
        };

        try {
          await applyToAJob(application);
          appliedJobTitle = job.title;
        } catch (e) {
          console.error('[PaymentSuccess] auto-apply failed —', e);
          applyError = 'submit';
        }
      }
    } else if (!session) {
      applyError = 'auth';
    } else if (!job) {
      applyError = 'job';
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
      {/* success hero — glow-এর উপর icon badge */}
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 scale-150 rounded-full bg-emerald-500/20 blur-2xl"
          aria-hidden
        />
        <div className="flex size-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <BadgeCheck className="size-9 text-emerald-400" aria-hidden />
        </div>
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-white">
        Payment successful
      </h1>
      <p className="mt-2 text-sm text-[#a0a0ab]">
        Your payment has been processed. Thank you for subscribing to HireLoop
        Pro Plan.
      </p>

      {/* transaction receipt — Stripe session থেকে পাওয়া details */}
      {transaction && (
        <div className="mt-7 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141418] text-left shadow-2xl shadow-black/40">
          {/* card header — receipt title + paid pill */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
            <p
              className={`text-[11px] font-medium uppercase tracking-wider ${textMuted}`}
            >
              Payment receipt
            </p>
            <span
              className={
                transaction.paymentStatus === 'paid'
                  ? 'rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300'
                  : 'rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-300'
              }
            >
              {transaction.paymentStatus === 'paid'
                ? 'Paid'
                : (transaction.paymentStatus ?? 'Unknown')}
            </span>
          </div>

          <div className="px-5 pb-5 pt-4">
            {/* amount — receipt-এর সবচেয়ে গুরুত্বপূর্ণ তথ্য, বড় করে দেখাই */}
            <p className={`text-xs ${textMuted}`}>Amount paid</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {transaction.amountPaid ?? '—'}
              {transaction.currency && (
                <span className={`ml-2 text-sm font-normal ${textMuted}`}>
                  {transaction.currency}
                </span>
              )}
            </p>

            {/* transaction ID — payment_intent.id-ই আসল transaction; copy করা যায় */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-[10px] font-medium uppercase tracking-wider ${textMuted}`}
                >
                  Transaction ID
                </p>
                <CopyButton
                  value={
                    transaction.paymentIntentId ?? transaction.transactionId ?? ''
                  }
                />
              </div>
              <p className="mt-1 break-all font-mono text-xs text-emerald-300">
                {transaction.paymentIntentId ?? transaction.transactionId ?? '—'}
              </p>
            </div>

            <dl className="mt-4 space-y-3">
              <div className="flex items-baseline justify-between gap-3">
                <dt className={`text-xs ${textMuted}`}>Customer email</dt>
                <dd className={`break-all text-right text-xs ${textPrimary}`}>
                  {transaction.customerEmail ?? 'Not provided'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={`text-xs ${textMuted}`}>Session ID</dt>
                <dd
                  className={`break-all text-right font-mono text-xs ${textPrimary}`}
                >
                  {transaction.transactionId ?? '—'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={`text-xs ${textMuted}`}>Paid at</dt>
                <dd className={`text-right text-xs ${textPrimary}`}>
                  {transaction.createdAt ?? '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* pay-to-apply — application submit হলে job-এর নামসহ জানাই */}
      {appliedJobTitle && (
        <p className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your application for <strong>{appliedJobTitle}</strong> has been
          submitted.
        </p>
      )}

      {/* payment হয়েছে কিন্তু apply হয়নি — কারণ অনুযায়ী user-কে জানাই */}
      {applyError === 'submit' && (
        <p className="mt-5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Payment succeeded, but your application could not be submitted. Please
          try applying again from the job page.
        </p>
      )}
      {applyError === 'auth' && (
        <p className="mt-5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Payment succeeded, but you are not signed in. Please sign in and apply
          again from the job page.
        </p>
      )}
      {applyError === 'job' && (
        <p className="mt-5 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-300">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          Payment succeeded, but the job could not be found. It may have been
          removed.
        </p>
      )}

      <Link
        href="/dashboard/seeker/applications"
        className="mt-7 inline-flex h-11 items-center rounded-xl bg-[#fafafa] px-6 text-sm font-medium text-[#0b0b0c] transition-colors hover:bg-white"
      >
        View My Applications
      </Link>
      <Link
        href="/BrowseJobs"
        className={`mt-3 text-sm ${textMuted} transition-colors hover:text-white`}
      >
        Back to Browse Jobs
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
