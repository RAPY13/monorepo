"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getOnboardingProfile } from "@/lib/onboarding-profile";

export default function TenantRoutePage() {
  const router = useRouter();
  const [message, setMessage] = useState("Checking your tenant assignment...");

  useEffect(() => {
    let cancelled = false;

    async function routeUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/?openModal=1");
        return;
      }

      const { profile, error } = await getOnboardingProfile(supabase, user);

      if (cancelled) {
        return;
      }

      if (error) {
        setMessage("Resolving profile state...");
      }

      if (!profile?.role) {
        router.replace("/role");
        return;
      }

      const tenant = profile.tenant?.trim();
      const onboardingComplete = Boolean(profile.onboarding_complete);

      if (!tenant || !onboardingComplete) {
        router.replace("/tenant/onboarding");
        return;
      }

      router.replace(`/tenant/${tenant}/dashboard`);
    }

    void routeUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Tenant router</p>
        <p className="mt-4 text-xl font-semibold">{message}</p>
      </div>
    </main>
  );
}
