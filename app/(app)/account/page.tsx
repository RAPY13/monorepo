import Link from "next/link";
import { redirect } from "next/navigation";

import BillingPlans from "@/components/billing/BillingPlans";
import { getBillingAccess } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_plan, subscription_status, is_founder")
    .eq("id", user.id)
    .maybeSingle();

  const access = getBillingAccess(profile?.subscription_plan, profile?.subscription_status);
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;

  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Account</p>
          <h1 className="mt-3 text-4xl font-black uppercase">Membership</h1>
          <p className="mt-3 text-sm text-zinc-400">{user.email}</p>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Membership status">
          <Status label="Current plan" value={access.active ? profile?.subscription_plan ?? "Unknown" : "No active plan"} />
          <Status label="Subscription status" value={profile?.subscription_status ?? "Not subscribed"} />
          <Status label="Founder access" value={access.founder && profile?.is_founder ? "Unlocked" : "Locked"} />
        </section>

        <section className="border-t border-white/10 pt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase">Manage billing</h2>
              <p className="mt-1 text-sm text-zinc-500">Update payment details or cancel through Stripe.</p>
            </div>
            {portalUrl ? (
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-orange-500/50 px-4 py-3 text-xs font-black uppercase tracking-wider text-orange-400 transition hover:bg-orange-500 hover:text-black"
              >
                Manage billing
              </a>
            ) : (
              <span className="border border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-600">
                Billing portal unavailable
              </span>
            )}
          </div>
        </section>

        <section className="border-t border-white/10 pt-8">
          <BillingPlans currentPlan={profile?.subscription_plan ?? null} active={access.active} />
        </section>

        <Link href="/yard" className="inline-block text-sm font-bold text-zinc-500 hover:text-white">
          Back to the Yard
        </Link>
      </div>
    </main>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-zinc-950 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-4 text-lg font-black capitalize text-white">{value}</p>
    </div>
  );
}