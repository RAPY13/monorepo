"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { createClient } from "@/utils/supabase/client";
import { getOnboardingProfile, updateOnboardingProfile, type YardRole } from "@/lib/onboarding-profile";

const lanes: Array<{ role: YardRole; title: string; subtitle: string }> = [
  { role: "rapper", title: "Rapper", subtitle: "Write. Record. Compete." },
  { role: "producer", title: "Producer", subtitle: "Upload. Sell. Earn." },
  { role: "listener", title: "Listener", subtitle: "Vote. Discover. Support." },
];

export default function RolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState<YardRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/?openModal=1");
        return;
      }

      const { profile, error: profileError } = await getOnboardingProfile(supabase, user);

      if (cancelled) {
        return;
      }

      if (profileError) {
        setError(profileError);
      }

      if (profile?.role) {
        router.replace("/profile");
        return;
      }

      setLoading(false);
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (loading) {
      return;
    }

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }
    );
  }, [loading]);

  async function setRole(role: YardRole) {
    setSavingRole(role);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/?openModal=1");
      return;
    }

    const result = await updateOnboardingProfile(supabase, user, { role });

    if (result.error) {
      setError(result.error);
      setSavingRole(null);
      return;
    }

    router.push("/profile");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Role selection</p>
          <p className="mt-4 text-lg font-semibold">Loading your lane options...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-6 py-12 text-white sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,175,55,0.16),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(255,60,60,0.12),transparent_36%)]" />

      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Choose your lane</p>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-[0.08em] sm:text-6xl">Who enters the yard?</h1>
        <p className="mt-5 max-w-3xl text-lg text-zinc-300">Pick your role to customize battles, studio workflows, and tenant dashboard modules.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {lanes.map((lane, idx) => (
            <button
              key={lane.role}
              ref={(node) => {
                cardsRef.current[idx] = node;
              }}
              type="button"
              onClick={() => void setRole(lane.role)}
              disabled={Boolean(savingRole)}
              className="group rounded-[1.6rem] border border-white/12 bg-black/45 p-7 text-left transition hover:border-amber-300/60 hover:bg-black/60"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Lane</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white group-hover:text-amber-200">{lane.title}</h2>
              <p className="mt-3 text-zinc-300">{lane.subtitle}</p>
              <p className="mt-8 text-xs uppercase tracking-[0.35em] text-amber-300/90">
                {savingRole === lane.role ? "Applying..." : "Select lane"}
              </p>
            </button>
          ))}
        </div>

        {error ? <p className="mt-7 text-red-400">{error}</p> : null}
      </div>
    </main>
  );
}
