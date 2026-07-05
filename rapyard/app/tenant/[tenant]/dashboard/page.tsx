"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getOnboardingProfile } from "@/lib/onboarding-profile";

const modules = [
  { title: "Battles", desc: "Live clashes, scorecards, and lane rankings." },
  { title: "Studio", desc: "Draft bars, takes, stems, and collab sessions." },
  { title: "Marketplace", desc: "Publish beats, loops, packs, and exclusives." },
  { title: "Royalties", desc: "Track splits, statements, and payout lanes." },
  { title: "Feed", desc: "Tenant updates, drops, and culture pulse." },
  { title: "Notifications", desc: "Mentions, battle calls, and release alerts." },
];

export default function TenantDashboardPage() {
  const params = useParams<{ tenant: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("Member");

  useEffect(() => {
    let cancelled = false;

    async function verifyTenant() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/?openModal=1");
        return;
      }

      const { profile } = await getOnboardingProfile(supabase, user);

      if (cancelled) {
        return;
      }

      if (!profile?.role) {
        router.replace("/role");
        return;
      }

      if (!profile.tenant || !profile.onboarding_complete) {
        router.replace("/tenant/onboarding");
        return;
      }

      if (profile.tenant !== params.tenant) {
        router.replace(`/tenant/${profile.tenant}/dashboard`);
        return;
      }

      setUsername(profile.username || "Member");
      setLoading(false);
    }

    void verifyTenant();

    return () => {
      cancelled = true;
    };
  }, [params.tenant, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Tenant dashboard</p>
          <p className="mt-4 text-lg font-semibold">Loading tenant workspace...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2.2rem] border border-white/10 bg-black/60 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Tenant dashboard</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] sm:text-5xl">{params.tenant}</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">Welcome back, {username}. Your onboarding arc is complete and this is now your operating home.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/feed" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.28em]">
              Open Feed
            </Link>
            <Link href="/help" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.28em]">
              Open Help
            </Link>
            <Link href="/profile" className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.28em]">
              Open Profile
            </Link>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <article key={module.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.34em] text-red-300/90">Module</p>
              <h2 className="mt-3 text-2xl font-bold text-white">{module.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{module.desc}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
