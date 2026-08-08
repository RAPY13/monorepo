"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import Navbar from "@/components/layout/Navbar";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import Smoke from "@/components/landing/cinematic/Smoke";
import Embers from "@/components/landing/cinematic/Embers";

export default function Hero() {
  const logoSweep = useRef<HTMLDivElement | null>(null);
  const fenceSweep = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logoSweep.current) {
      gsap.to(logoSweep.current, {
        x: "170%",
        duration: 3,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 6,
      });
    }

    if (fenceSweep.current) {
      gsap.to(fenceSweep.current, {
        x: "150%",
        duration: 5,
        ease: "power3.inOut",
        repeat: -1,
        repeatDelay: 3,
      });
    }
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ============================================================ */}
      {/* BACKGROUND                                                    */}
      {/* ============================================================ */}

      <Image
        src="/rapyard-hero.png"
        alt=""
        priority
        width={1920}
        height={1080}
        className="absolute inset-0 -z-30 h-full w-full select-none object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-20 bg-black/35" />

      {/* Chain-link texture */}
      <Image
        src="/textures/chain-link-chrome.png"
        alt=""
        priority
        width={2048}
        height={2048}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none object-cover opacity-40 mix-blend-screen"
      />

      {/* Orange forge glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,110,0,.20),transparent_60%)]" />

      {/* ============================================================ */}
      {/* METALLIC FENCE SWEEP                                          */}
      {/* ============================================================ */}

      <div
        ref={fenceSweep}
        className="
          pointer-events-none
          absolute
          left-[-60%]
          top-0
          z-10
          h-full
          w-[20%]
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          blur-3xl
        "
      />

      {/* Cinematic atmosphere */}
      <Embers />
      <Smoke />

      {/* Bottom darkness */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* ============================================================ */}
      {/* NAVIGATION                                                    */}
      {/* ============================================================ */}

      <Navbar />

      {/* ============================================================ */}
      {/* HERO CONTENT                                                   */}
      {/* ============================================================ */}

      <div
        className="
          relative
          z-30
          mx-auto
          flex
          min-h-screen
          max-w-7xl
          flex-col
          items-center
          px-6
          pb-48
          pt-24
          text-center
        "
      >
        {/* ========================================================== */}
        {/* RAPYARD LOGO                                                */}
        {/* ========================================================== */}

        <div className="relative mb-8">
          <Image
            src="/logo.png"
            alt="RapYard"
            priority
            width={1200}
            height={650}
            className="
              mx-auto
              h-auto
              w-[420px]
              select-none
              drop-shadow-[0_0_80px_rgba(255,120,0,.35)]
              md:w-[700px]
              lg:w-[900px]
              xl:w-[1050px]
            "
          />

          {/* Logo metallic sweep */}
          <div
            ref={logoSweep}
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-[-60%]
              w-[25%]
              skew-x-[-20deg]
              bg-gradient-to-r
              from-transparent
              via-white/30
              to-transparent
              blur-xl
            "
          />
        </div>

        {/* ========================================================== */}
        {/* HEADLINE                                                     */}
        {/* ========================================================== */}

        <h1
          className="
            max-w-5xl
            text-3xl
            font-black
            uppercase
            leading-tight
            tracking-wide
            md:text-5xl
            lg:text-6xl
          "
        >
          <span className="block">Built for the culture.</span>
        </h1>

        {/* Supporting copy */}
        <div className="mt-10 space-y-3 text-base font-semibold md:text-lg">
          <p className="text-zinc-300">
            Where music brings people together.
          </p>

          <p className="uppercase tracking-[0.18em] text-zinc-200">
            Creators Build The Yard.
          </p>

          <p className="uppercase tracking-[0.18em] text-blue-400">
            Listeners Move The Yard.
          </p>

          <p className="uppercase tracking-[0.18em] text-zinc-200">
            Together, We Own The Yard.
          </p>
        </div>

        {/* ========================================================== */}
        {/* MAGIC LINK                                                   */}
        {/* ========================================================== */}

        <div
          className="
            mt-10
            w-full
            max-w-3xl
            rounded-xl
            border
            border-orange-500/30
            bg-black/55
            p-6
            backdrop-blur-sm
          "
        >
          <MagicLinkForm />

          <p className="mt-4 text-sm text-zinc-400">
            No passwords • Secure Magic Link Sign In
          </p>
        </div>

        {/* ========================================================== */}
        {/* ENTER THE YARD CTA                                          */}
        {/* ========================================================== */}

        <button
          type="button"
          className="
            mt-8
            rounded-lg
            border
            border-orange-500
            bg-orange-500/10
            px-12
            py-4
            text-lg
            font-bold
            uppercase
            tracking-widest
            text-orange-300
            transition-all
            duration-300
            hover:bg-orange-500
            hover:text-white
            hover:shadow-[0_0_40px_rgba(255,110,0,.45)]
          "
        >
          Enter The Yard →
        </button>

        {/* ========================================================== */}
        {/* FOUNDERS EDITION                                            */}
        {/* ========================================================== */}

        <div
          className="
            mt-10
            w-full
            max-w-2xl
            rounded-2xl
            border
            border-white/10
            bg-black/45
            p-8
            backdrop-blur-md
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-orange-500/30
              bg-orange-500/10
              text-orange-400
            "
          >
            ◈
          </div>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-[0.35em] text-white">
            Founders Edition
          </h2>

          <p className="mt-6 text-sm leading-7 text-zinc-400">
            Early members receive priority access as RapYard opens its gates.
          </p>

          <p className="mt-5 text-sm font-semibold text-orange-300">
            ⚒ Built for creators. Powered by the culture.
          </p>

          <p className="mt-5 text-xs leading-6 text-zinc-500">
            Your Magic Link is passwordless, secure, and used only to access
            your RapYard account. No passwords to remember. No spam.
          </p>
        </div>

        {/* ========================================================== */}
        {/* SCROLL                                                       */}
        {/* ========================================================== */}

        <div className="mt-16 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.4em] text-zinc-500">
            Scroll
          </span>

          <div className="mt-3 flex h-10 w-6 justify-center rounded-full border border-zinc-500">
            <div className="mt-2 h-2 w-2 animate-bounce rounded-full bg-orange-500" />
          </div>

          <span className="mt-2 text-zinc-600">⌄</span>
        </div>

        {/* ========================================================== */}
        {/* BLEED THA BLOCK LABEL                                       */}
        {/* ONE SINGLE IMAGE                                             */}
        {/* ========================================================== */}

        <div
          className="
            relative
            mt-24
            flex
            w-full
            justify-center
          "
        >
          <Image
            src="/images/hero/Bleed-Tha-Block-Label.png"
            alt="Bleed Tha Block Label"
            width={650}
            height={500}
            priority
            className="
              h-auto
              w-[220px]
              select-none
              drop-shadow-[0_0_60px_rgba(255,80,0,.40)]
              md:w-[300px]
              lg:w-[380px]
            "
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* HERO BOTTOM FADE                                              */}
      {/* ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-72
          bg-gradient-to-t
          from-black
          via-black/80
          to-transparent
        "
      />
    </section>
  );
}