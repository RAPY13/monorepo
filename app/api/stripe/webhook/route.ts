import Stripe from "stripe";
import { NextResponse } from "next/server";

import { hasActiveSubscription, supabaseAdmin } from "@/lib/billing";
import { getBillingPlanFromPriceId, stripe } from "@/lib/stripe";

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackMetadata: Record<string, string | undefined> = {},
) {
  const userId =
    subscription.metadata.supabase_user_id ?? fallbackMetadata.supabase_user_id;
  const inferredPlanFromPrice =
    getBillingPlanFromPriceId(
      subscription.items.data[0]?.price && typeof subscription.items.data[0].price !== "string"
        ? subscription.items.data[0].price.id
        : null,
    ) ?? null;
  const plan =
    subscription.metadata.plan ?? fallbackMetadata.plan ?? inferredPlanFromPrice;

  if (!userId || !plan) {
    console.error("[Stripe Webhook] Subscription metadata is incomplete", {
      subscriptionId: subscription.id,
      metadata: subscription.metadata,
      fallbackMetadata,
      inferredPlanFromPrice,
    });
    return;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      stripe_customer_id: String(subscription.customer),
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      subscription_plan: plan,
      is_founder: plan === "founder" && hasActiveSubscription(subscription.status),
    })
    .eq("id", userId);

  if (error) {
    throw new Error(`Supabase update failed: ${error.message}`);
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("[Stripe Webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (typeof session.subscription === "string") {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      try {
        await syncSubscription(subscription, session.metadata ?? {});
      } catch (error) {
        console.error("[Stripe Webhook] Checkout synchronization failed:", error);
        return NextResponse.json({ error: "Unable to synchronize checkout." }, { status: 500 });
      }
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      await syncSubscription(subscription);
    } catch (error) {
      console.error("[Stripe Webhook] Subscription synchronization failed:", error);
      return NextResponse.json({ error: "Unable to synchronize subscription." }, { status: 500 });
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      invoice.parent?.subscription_details &&
      typeof invoice.parent.subscription_details.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : null;

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      try {
        await syncSubscription(subscription);
      } catch (error) {
        console.error("[Stripe Webhook] Payment-failure synchronization failed:", error);
        return NextResponse.json({ error: "Unable to synchronize payment failure." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}