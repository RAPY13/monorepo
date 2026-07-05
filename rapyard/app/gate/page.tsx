"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { createClient } from "@/utils/supabase/client";

export default function GatePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const doorLeft = useRef<HTMLDivElement | null>(null);
  const doorRight = useRef<HTMLDivElement | null>(null);
  const gateTitle = useRef<HTMLHeadingElement | null>(null);
  const enterButton = useRef<HTMLButtonElement | null>(null);
  const fog = useRef<HTMLDivElement | null>(null);
  const spark = useRef<HTMLDivElement | null>(null);
  const glow = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      const authCookie = document.cookie
        .split("; ")
        .some((cookie) => cookie.trim().startsWith("rapyard-auth="));

      if (!user && !authCookie) {
        router.replace("/?openModal=1");
        return;
      }

      setHasSession(true);
    }

    void verifySession();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!hasSession) {
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setReady(true),
    });

    tl.fromTo(
      [doorLeft.current, doorRight.current],
      { xPercent: 0 },
      { xPercent: (index) => (index === 0 ? -102 : 102), duration: 1.15, stagger: 0.02 }
    )
      .fromTo(
        glow.current,
        { opacity: 0.15, scale: 0.88 },
        { opacity: 0.85, scale: 1, duration: 0.9 },
        "<0.2"
      )
      .fromTo(
        fog.current,
        { opacity: 0.1, y: 40 },
        { opacity: 0.62, y: 0, duration: 1.1 },
        "<0.15"
      )
      .fromTo(
        spark.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 0.8, scale: 1.06, duration: 0.5, yoyo: true, repeat: 1 },
        "<0.15"
      )
      .fromTo(
        gateTitle.current,
        { opacity: 0, y: 18, letterSpacing: "0.45em" },
        { opacity: 1, y: 0, letterSpacing: "0.22em", duration: 0.8 },
        "-=0.35"
      )
      .fromTo(
        enterButton.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, [hasSession]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-6 py-12 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div className="pointer-events-none absolute inset-0 z-20">
        <div ref={doorLeft} className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black via-zinc-900 to-zinc-800/75" />
        <div ref={doorRight} className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-black via-zinc-900 to-zinc-800/75" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div ref={glow} className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-red-500/15 blur-[140px]" />
        <div ref={fog} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.18),transparent_40%)]" />
        <div ref={spark} className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,208,120,0.22),transparent_30%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,180,75,0.14),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_50%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[88vh] w-full max-w-7xl items-center">
        <section className="grid w-full gap-6 rounded-[2.2rem] border border-white/10 bg-black/55 p-7 shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:gap-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:p-14 xl:p-16">
          <div className="space-y-6 sm:space-y-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-amber-300/95 sm:text-xs">
              Post-auth cinematic gate
            </p>

            <div className="space-y-4 sm:space-y-6">
              <h1
                ref={gateTitle}
                className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl xl:text-8xl"
              >
                The Yard wakes when you enter.
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-zinc-200/90 sm:text-xl md:text-2xl">
                Steel doors unlocked. Fog rises. Sparks flare. Choose your lane and step into your tenant world.
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  ref={enterButton}
                  type="button"
                  onClick={() => router.replace("/role")}
                  disabled={!ready}
                  className="rounded-full bg-amber-400 px-9 py-4 text-sm font-black uppercase tracking-[0.24em] text-black transition hover:bg-amber-300 sm:px-10 sm:text-base"
                >
                  {ready ? "Enter The Yard" : "Preparing Gate"}
                </button>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50 sm:text-sm">
              {ready ? "Gate sequence complete" : "Running gate sequence"}
            </p>
          </div>

          <aside className="rounded-[1.8rem] border border-white/12 bg-white/[0.04] p-6 sm:p-8 lg:p-9">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.42em] text-amber-300/95 sm:text-xs">Onboarding arc</p>
            <div className="space-y-4 text-base text-zinc-100/90 sm:space-y-5 sm:text-lg">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">1. Session check</p>
                <p className="mt-2 text-zinc-300">Verify user, role, tenant, onboarding status.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">2. Choose lane</p>
                <p className="mt-2 text-zinc-300">Rapper, Producer, or Listener personalization.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <p className="font-semibold uppercase tracking-[0.18em] text-white">3. Assign tenant</p>
                <p className="mt-2 text-zinc-300">Create or join tenant before dashboard handoff.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
