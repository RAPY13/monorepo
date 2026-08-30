"use client";

import { Crown, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

type Plan = "member" | "pro" | "founder";

const plans: Array<{
  id: Plan;
  name: string;
  price: string;
  detail: string;
  features: string[];
}> = [
  {
    id: "member",
    name: "Yard Member",
    price: "$5.99 / month",
    detail: "Full access to the core RapYard creator network.",
    features: [
      "Enter the full Yard",
      "Creator profile access",
      "Recording and project tools",
    ],
  },
  {
    id: "pro",
    name: "Yard Pro",
    price: "$19.99 / month",
    detail: "Built for creators ready to push their work further.",
    features: [
      "Everything in Yard Member",
      "Advanced creator tools",
      "Expanded workflow access",
    ],
  },
  {
    id: "founder",
    name: "Founder",
    price: "$99 one time",
    detail: "Optional lifetime Founder recognition and premium RapYard status.",
    features: [
      "Everything in Yard Pro",
      "Founder recognition",
      "Premium RapYard status",
    ],
  },
];

type Props = {
  currentPlan: string | null;
  active: boolean;
};

function formatPlanName(plan: string | null) {
  if (plan === "member") return "Yard Member";
  if (plan === "pro") return "Yard Pro";
  if (plan === "founder") return "Founder";
  return "Free";
}

export default function BillingPlans({
  currentPlan,
  active,
}: Props) {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayPlan = active
    ? formatPlanName(currentPlan)
    : "Free";

  async function manageMembership() {
    setLoadingPlan(null);
    setError(null);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ?? "Unable to open membership management.",
        );
      }

      window.location.assign(result.url);
    } catch (portalError) {
      setError(
        portalError instanceof Error
          ? portalError.message
          : "Unable to open membership management.",
      );
    }
  }

  async function startCheckout(plan: Plan) {
    if (active && currentPlan === plan) return;

    setLoadingPlan(plan);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(
          result.error ?? "Unable to start checkout.",
        );
      }

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout.",
      );

      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        <div className="border-b border-white/10 px-6 py-8 md:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            RapYard Membership
          </p>

          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
                Unlock the Yard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
                Choose the level that matches how you create.
                Your membership controls access to RapYard creator
                features and premium tools.
              </p>
            </div>

            <div className="min-w-[220px] rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Current plan
              </p>

              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-orange-400" />

                <span className="text-lg font-black uppercase text-white">
                  {displayPlan}
                </span>
              </div>

              <p className="mt-1 text-xs text-zinc-500">
                {active
                  ? "Membership active"
                  : "No active paid membership"}
              </p>
            </div>
          </div>

          {active && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void manageMembership()}
                disabled={loadingPlan !== null}
                className="rounded-md border border-orange-500/50 bg-orange-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-orange-300 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Manage Membership
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent =
            active && currentPlan === plan.id;

          const isFounder = plan.id === "founder";

          return (
            <article
              key={plan.id}
              className={[
                "relative flex min-h-[360px] flex-col rounded-2xl border p-6",
                isFounder
                  ? "border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-zinc-950"
                  : "border-white/10 bg-zinc-950",
                isCurrent
                  ? "ring-1 ring-orange-500/50"
                  : "",
              ].join(" ")}
            >
              {isFounder && (
                <div className="mb-4 flex items-center gap-2 text-orange-400">
                  <Crown className="h-4 w-4" />

                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                    Founder Status
                  </span>
                </div>
              )}

              <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-400">
                {plan.name}
              </p>

              <p className="mt-5 text-3xl font-black text-white">
                {plan.price}
              </p>

              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
                {plan.detail}
              </p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => startCheckout(plan.id)}
                disabled={loadingPlan !== null || isCurrent}
                className={[
                  "mt-auto w-full rounded-md px-4 py-3 text-sm font-black uppercase tracking-wider transition",
                  isCurrent
                    ? "cursor-default border border-orange-500/30 bg-orange-500/10 text-orange-400"
                    : "bg-orange-500 text-black hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50",
                ].join(" ")}
              >
                {loadingPlan === plan.id
                  ? "Opening..."
                  : isCurrent
                    ? "Current plan"
                    : "Choose plan"}
              </button>
            </article>
          );
        })}
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </div>
      )}
    </div>
  );
}
