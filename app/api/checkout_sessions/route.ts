import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Stripe client — secret key শুধু server-side-এ থাকে, client-এ কখনো পাঠানো হয় না
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

// payment page-এর form POST এখানে আসে — Stripe Checkout session তৈরি করে
// 303 redirect-এ Stripe-এর hosted checkout page-এ পাঠিয়ে দেয় (user সেখানেই pay করবে)
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  // form-এর hidden jobId — job details-এর Apply Now থেকে আসে; না থাকলে সাধারণ plan purchase
  const formData = await request.formData();
  const jobId = String(formData.get('jobId') ?? '').trim();

  // jobId থাকলে success/cancel URL-এও বহন করি — success পেজ এই job-এ apply করবে,
  // cancel হলে payment পেজে ফিরে এসে আবার একই job-এর checkout শুরু করা যাবে
  // {CHECKOUT_SESSION_ID} — Stripe-এর template, redirect-এর সময় আসল session id বসে যায়
  const successUrl = jobId
    ? `${origin}/payment/success?jobId=${encodeURIComponent(jobId)}&session_id={CHECKOUT_SESSION_ID}`
    : `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = jobId
    ? `${origin}/payment?jobId=${encodeURIComponent(jobId)}&canceled=1`
    : `${origin}/payment?canceled=1`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            // Stripe BDT কারেন্সি support করে না — UI-তে BDT দেখানো হয়,
            // কিন্তু আসল চার্জ হয় $20.00 USD (১২৭.৬৬৬৫ rate অনুযায়ী ≈ BDT 2,553.33)
            currency: 'usd',
            unit_amount: 2000,
            product_data: {
              name: 'Hireloop Pro Plan',
              description: 'Access to all features',
            },
          },
        },
      ],
      // payment সফল হলে success পেজে, cancel করলে আবার payment পেজে ফিরে আসবে
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // session.url — Stripe-এর hosted checkout page-এর লিংক
    return NextResponse.redirect(session.url as string, 303);
  } catch (error) {
    console.error('[checkout_sessions] Stripe error —', error);
    return NextResponse.redirect(`${origin}/payment?error=stripe`, 303);
  }
}
