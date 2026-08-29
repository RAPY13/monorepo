import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/billing";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireUser();

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "[Stripe Portal] Profile lookup failed:",
      profileError.message,
    );

    return NextResponse.json(
      { error: "Unable to load billing profile." },
      { status: 500 },
    );
  }

  const customerId = profile?.stripe_customer_id;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer is connected to this account." },
      { status: 400 },
    );
  }

  try {
    const origin = new URL(request.url).origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/billing`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "[Stripe Portal] Unable to create portal session:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to open membership management." },
      { status: 500 },
    );
  }
}
