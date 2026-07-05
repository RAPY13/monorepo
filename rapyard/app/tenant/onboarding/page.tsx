"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { createClient } from "@/utils/supabase/client";
import { getOnboardingProfile, updateOnboardingProfile, type YardRole } from "@/lib/onboarding-profile";

const REGION_OPTIONS = ["us-east", "us-west", "eu-central", "ap-south"];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 42);
}

export default function TenantOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<YardRole | null>(null);

  const [tenantName, setTenantName] = useState("");
  const [region, setRegion] = useState(REGION_OPTIONS[0]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [faction, setFaction] = useState("");

  const tenantSlug = useMemo(() => slugify(tenantName), [tenantName]);

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

      if (!profile?.role) {
        router.replace("/role");
        return;
      }

      if (profile.tenant && profile.onboarding_complete) {
        router.replace(`/tenant/${profile.tenant}/dashboard`);
        return;
      }

      setRole(profile.role);
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
      ".tenant-panel",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, [loading]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!tenantSlug) {
      setError("Choose a tenant name to continue.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/?openModal=1");
      return;
    }

    const result = await updateOnboardingProfile(supabase, user, {
      tenant: tenantSlug,
      onboarding_complete: true,
      tenant_region: region,
      avatar_url: avatarUrl || null,
      tenant_banner_url: bannerUrl || null,
      tenant_faction: faction || null,
    });

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push(`/tenant/${tenantSlug}/dashboard`);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Tenant onboarding</p>
          <p className="mt-4 text-lg font-semibold">Preparing your onboarding shell...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white sm:px-8 sm:py-16">
      <div className="tenant-panel mx-auto max-w-4xl rounded-[2.2rem] border border-white/10 bg-black/60 p-7 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10 lg:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/90">Tenant onboarding</p>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] sm:text-5xl">Forge your tenant identity</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Configure your RapYard base before entering dashboard modules. Your lane: <span className="font-semibold text-amber-200">{role}</span>
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Tenant name</span>
            <input
              value={tenantName}
              onChange={(event) => setTenantName(event.target.value)}
              placeholder="Steel-Cypher"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
            />
            <span className="text-xs text-zinc-500">Slug preview: {tenantSlug || "-"}</span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
            >
              {REGION_OPTIONS.map((item) => (
                <option key={item} value={item} className="bg-zinc-900 text-white">
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Avatar URL</span>
            <input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Banner URL</span>
            <input
              value={bannerUrl}
              onChange={(event) => setBannerUrl(event.target.value)}
              placeholder="https://..."
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Faction (optional)</span>
            <input
              value={faction}
              onChange={(event) => setFaction(event.target.value)}
              placeholder="Iron Verse"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-300/60"
            />
          </label>

          {error ? <p className="text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-full bg-amber-400 px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {saving ? "Building Tenant" : "Enter Tenant Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
