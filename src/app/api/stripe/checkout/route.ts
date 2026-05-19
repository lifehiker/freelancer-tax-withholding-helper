import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { appUrl } from "@/lib/utils";

export async function POST(request: Request) {
  const user = await requireUser();
  const { plan } = await request.json().catch(() => ({ plan: "monthly" }));
  const key = process.env.STRIPE_SECRET_KEY;
  const price = plan === "annual" ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
  if (!key || !price) {
    return NextResponse.json({
      ok: true,
      fallback: true,
      message: "Stripe is not configured. In production this button opens Checkout; locally the app remains usable on the free tier.",
    });
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(key);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    customer_email: user.email || undefined,
    success_url: appUrl("/dashboard?upgraded=1"),
    cancel_url: appUrl("/pricing"),
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
  });
  return NextResponse.json({ url: session.url });
}
