import { redirect } from "next/navigation";

import BillingPlans from "@/components/billing/BillingPlans";
import { getBillingAccess } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  const access = getBillingAccess(profile?.subscription_plan, profile?.subscription_status);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <BillingPlans currentPlan={profile?.subscription_plan ?? null} active={access.active} />
      </div>
    </main>
  );
}