import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured.");
}

export const stripe = new Stripe(secretKey);

export const stripePriceIds = {
  member: process.env.STRIPE_MEMBER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
  founder: process.env.STRIPE_FOUNDER_PRICE_ID,
} as const;

export type BillingPlan = keyof typeof stripePriceIds;

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === "member" || value === "pro" || value === "founder";
}