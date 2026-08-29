"use client";

import { useState } from "react";

type Plan = "member" | "pro" | "founder";

const plans: Array<{ id: Plan; name: string; price: string; detail: string }> = [
  { id: "member", name: "Yard Member", price: "$9.99 / month", detail: "Enter the full Yard." },
  { id: "pro", name: "Yard Pro", price: "$19.99 / month", detail: "Unlock advanced creator tools." },
  { id: "founder", name: "Founder", price: "$99 / month", detail: "Founder access and recognition." },
];

type Props = {
  currentPlan: string | null;
  active: boolean;
};

export default function BillingPlans({ currentPlan, active }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to start checkout.");
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Membership</p>
        <h1 className="mt-3 text-4xl font-black uppercase">Unlock the Yard</h1>
        <p className="mt-3 text-zinc-400">
          {active ? `Active plan: ${currentPlan}.` : "Choose a plan to unlock creator features."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.id} className="border border-white/10 bg-zinc-950 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">{plan.name}</p>
            <p className="mt-5 text-2xl font-black">{plan.price}</p>
            <p className="mt-3 min-h-12 text-sm text-zinc-400">{plan.detail}</p>
            <button
              type="button"
              onClick={() => startCheckout(plan.id)}
              disabled={loadingPlan !== null}
              className="mt-6 w-full bg-orange-500 px-4 py-3 text-sm font-black uppercase tracking-wider text-black transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50"
            >
              {loadingPlan === plan.id ? "Opening..." : currentPlan === plan.id && active ? "Current plan" : "Choose plan"}
            </button>
          </article>
        ))}
      </div>

      {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
    </div>
  );
}