import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

export const stripe = new Stripe(secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

export const stripePriceIds = {
  member: process.env.STRIPE_MEMBER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  founder: process.env.STRIPE_FOUNDER_PRICE_ID,
} as const;

export type BillingPlan = keyof typeof stripePriceIds;

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === "member" || value === "pro" || value === "founder";
}

export function getStripePriceId(plan: BillingPlan) {
  const priceId = stripePriceIds[plan];

  if (!priceId) {
    throw new Error(`Missing Stripe price id for plan "${plan}". Set STRIPE_${plan.toUpperCase()}_PRICE_ID.`);
  }

  return priceId;
}

export function getBillingPlanFromPriceId(priceId: string | null | undefined): BillingPlan | null {
  if (!priceId) {
    return null;
  }

  const match = Object.entries(stripePriceIds).find(([, configuredPriceId]) => configuredPriceId === priceId);
  return match ? (match[0] as BillingPlan) : null;
}

const configuredPriceIds = Object.values(stripePriceIds).filter(Boolean);

if (configuredPriceIds.length !== new Set(configuredPriceIds).size) {
  throw new Error("Stripe price ids must be unique across plans. Duplicate values are configured for multiple plans.");
}