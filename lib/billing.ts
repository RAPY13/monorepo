import { createClient } from "@supabase/supabase-js";

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseSecretKey) {
  throw new Error("SUPABASE_SECRET_KEY is not configured.");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseSecretKey,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export const ACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
]);

export function hasActiveSubscription(status: string | null | undefined) {
  return Boolean(status && ACTIVE_SUBSCRIPTION_STATUSES.has(status));
}

export function getBillingAccess(
  plan: string | null | undefined,
  status: string | null | undefined,
) {
  const active = hasActiveSubscription(status);

  return {
    active,
    member: active && (plan === "member" || plan === "pro" || plan === "founder"),
    pro: active && (plan === "pro" || plan === "founder"),
    founder: active && plan === "founder",
  };
}