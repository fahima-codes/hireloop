import type { Metadata } from 'next';

import { PaymentView } from '@/app/payment/components/PaymentView';

// Stripe Checkout-এর ডিজাইন করা payment পেজ — pay-to-apply ফ্লোর জন্য
// job details-এর Apply Now এখানে redirect করে; আসল Stripe integration পরে বসবে
export const metadata: Metadata = {
  title: 'Checkout — HireLoop',
};

const PaymentPage = () => {
  return <PaymentView />;
};

export default PaymentPage;
