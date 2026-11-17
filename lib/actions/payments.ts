// payment verify — Stripe session id দিয়ে backend নিজে Stripe-এ payment যাচাই করে,
// payments collection-এ record রাখে আর user-কে premium বানায়
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const checkoutVerify = async (sessionId: string, userId?: string) => {
  const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, userId }),
  });
  return response.json();
};
