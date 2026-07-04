"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const router = useRouter();
  const hasAuth =
    typeof document !== "undefined" &&
    document.cookie.split("; ").some((cookie) => cookie.trim().startsWith("rapyard-auth="));

  useEffect(() => {
    if (hasAuth) {
      const timer = window.setTimeout(() => router.replace("/feed"), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [hasAuth, router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-12 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-red-500/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,180,75,0.14),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_50%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl items-center">
        <section className="grid w-full gap-6 rounded-[2.2rem] border border-white/10 bg-black/55 p-7 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:gap-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-14 xl:p-16">
          <div className="space-y-6 sm:space-y-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-amber-300/95 sm:text-xs">
              Founders access only
            </p>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl xl:text-8xl">
                {hasAuth ? "The gate remembers your name." : "The gate is closed until you claim your seat."}
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-zinc-200/90 sm:text-xl md:text-2xl">
                {hasAuth
                  ? "Your founder token is active. We are opening the Yard now and sending you straight into the feed."
                  : "Use your email on the main page to unlock access, secure your founders badge, and step into the first wave."}
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => router.replace(hasAuth ? "/feed" : "/?openModal=1")}
                  className="rounded-full bg-amber-400 px-9 py-4 text-sm font-black uppercase tracking-[0.24em] text-black transition hover:bg-amber-300 sm:px-10 sm:text-base"
                >
                  {hasAuth ? "Enter The Feed" : "Claim Founder Access"}
                </button>

                {!hasAuth && (
                  <button
                    type="button"
                    onClick={() => router.replace("/")}
                    className="rounded-full border border-white/20 bg-white/5 px-9 py-4 text-sm font-bold uppercase tracking-[0.22em] text-white transition hover:border-white/35 hover:bg-white/10 sm:px-10 sm:text-base"
                  >
                    Back To Main Page
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              {hasAuth ? "Redirecting in a moment" : "No token found. Waitlist unlock required."}
            </p>
          </div>

          <aside className="rounded-[1.8rem] border border-white/12 bg-white/[0.04] p-6 sm:p-8 lg:p-9">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-amber-300/95 sm:text-xs">Gate checklist</p>
            <div className="space-y-4 text-base text-zinc-100/90 sm:space-y-5 sm:text-lg">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">1. Join waitlist</p>
                <p className="mt-2 text-zinc-300">Submit your email from the home screen to reserve a founder slot.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">2. Get verified</p>
                <p className="mt-2 text-zinc-300">A secure auth cookie unlocks your entry path and private feed.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">3. Enter the Yard</p>
                <p className="mt-2 text-zinc-300">Return here and pass through the gate when access is live.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
