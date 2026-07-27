"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import Navbar from "@/components/layout/Navbar";
import MagicLinkForm from "@/components/gate/MagicLinkForm";
import Smoke from "@/components/landing/cinematic/Smoke";
import Embers from "@/components/landing/cinematic/Embers";

export default function Hero() {
  const logoSweep = useRef<HTMLDivElement>(null);
  const fenceSweep = useRef<HTMLDivElement>(null);

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
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Background */}
      {/* ---------------------------------------------------------------- */}

      <Image
        src="/rapyard-hero.png"
        alt=""
        priority
        width={1920}
        height={1080}
        className="absolute inset-0 -z-30 h-full w-full object-cover select-none"
      />

      <div className="absolute inset-0 -z-20 bg-black/35" />

      <Image
        src="/textures/chain-link-chrome.png"
        alt=""
        priority
        width={2048}
        height={2048}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-40 mix-blend-screen select-none"
      />

      {/* Orange Forge Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,110,0,.20),transparent_60%)]" />

      {/* Metallic Sweep */}
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

      <Embers />
      <Smoke />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      <Navbar />

      {/* ---------------------------------------------------------------- */}
      {/* Content */}
      {/* ---------------------------------------------------------------- */}

      <div className="relative z-30 mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-24 text-center">
        {/* RapYard Logo */}

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

        {/* Bleed Tha Block */}

        <Image
          src="/bleed-tha-block.png"
          alt="Bleed Tha Block"
          width={650}
          height={500}
          priority
          className="
            mb-10
            h-auto
            w-[240px]
            drop-shadow-[0_0_50px_rgba(255,80,0,.35)]
            md:w-[330px]
            lg:w-[420px]
          "
        />

        {/* Headline */}

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
          <span className="block">
            Creators Build The Yard.
          </span>

          <span className="block">
            Listeners Move The Yard.
          </span>

          <span className="mt-3 block text-orange-500">
            Together. We Own The Yard.
          </span>
        </h1>

        {/* Features */}

        <div
          className="
            mt-10
            flex
            flex-wrap
            items-center
            justify-center
            gap-8
            text-lg
            font-semibold
            text-orange-300
          "
        >
          <span>🎤 Create</span>
          <span>🤝 Collaborate</span>
          <span>🏆 Compete</span>
        </div>

        {/* Magic Link */}

        <div
          className="
            mt-12
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

        {/* CTA */}

        <button
          className="
            mt-10
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
          ENTER THE YARD →
        </button>

        {/* Scroll */}

        <div className="mt-16 flex flex-col items-center">
          <div className="flex h-10 w-6 justify-center rounded-full border border-zinc-500">
            <div className="mt-2 h-2 w-2 animate-bounce rounded-full bg-orange-500" />
          </div>

          <span className="mt-3 text-xs uppercase tracking-[0.4em] text-zinc-500">
            Scroll
          </span>
        </div>
      </div>

      {/* Bottom Fade */}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </section>
  );
}