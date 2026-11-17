import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/core/server';

export async function POST() {
  // getSession একটা async function — call না করলে ভেতরের session object পাওয়া যায় না
  const userSsession = await getSession();

  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1Uc63xJ3hkSeZwJGdGi6eGVq',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userSsession?.user.email,
      metadata: {
        // session না থাকলে null — Stripe metadata-র value string | number | null হতে পারে
        userId: userSsession?.user.id ?? null,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'hireloop_web_001',
    });
    return NextResponse.redirect(session.url as string, 303);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
