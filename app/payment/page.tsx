import type { Metadata } from 'next';

import PaymentView from '@/app/payment/components/PaymentView';

// Stripe Checkout-এর ডিজাইন করা payment পেজ — pay-to-apply ফ্লোর জন্য
// job details-এর Apply Now এখানে redirect করে
export const metadata: Metadata = {
  title: 'Checkout — HireLoop',
};

// searchParams একটা Promise — await করে বের করতে হয় (sync access করলে Next error দেয়)
// jobId — job details-এর Apply Now থেকে আসে; payment success-এ এই job-এ apply হবে
const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; jobId?: string }>;
}) => {
  const { canceled, jobId } = await searchParams;

  return <PaymentView canceled={canceled} jobId={jobId} />;
};

export default PaymentPage;
