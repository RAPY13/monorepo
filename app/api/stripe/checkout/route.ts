import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import {
  isBillingPlan,
  stripe,
  stripePriceIds,
} from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/billing";

export async function POST(request: Request) {
  const user = await requireUser();
  const body = (await request.json().catch(() => null)) as {
    plan?: unknown;
  } | null;

  if (!isBillingPlan(body?.plan)) {
    return NextResponse.json({ error: "Invalid billing plan." }, { status: 400 });
  }

  const priceId = stripePriceIds[body.plan];
  if (!priceId) {
    return NextResponse.json(
      { error: `Stripe price is not configured for ${body.plan}.` },
      { status: 503 },
    );
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[Stripe Checkout] Profile lookup failed:", profileError.message);
    return NextResponse.json({ error: "Unable to load billing profile." }, { status: 500 });
  }

  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    const { error: customerUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);

    if (customerUpdateError) {
      console.error("[Stripe Checkout] Customer save failed:", customerUpdateError.message);
      return NextResponse.json({ error: "Unable to save billing customer." }, { status: 500 });
    }
  }

  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/billing?checkout=success`,
    cancel_url: `${origin}/billing?checkout=cancelled`,
    metadata: { supabase_user_id: user.id, plan: body.plan },
    subscription_data: {
      metadata: { supabase_user_id: user.id, plan: body.plan },
    },
  });

  return NextResponse.json({ url: session.url });
}