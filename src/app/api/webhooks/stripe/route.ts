import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !secret) {
    return NextResponse.json({ ok: true, fallback: true });
  }
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const event = stripe.webhooks.constructEvent(body, signature, secret);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
          subscriptionStatus: "active",
        },
      });
    }
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted" || event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    const userId = subscription.metadata?.userId;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : undefined,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
        },
      });
    }
  }
  return NextResponse.json({ received: true });
}
