"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

import HeroBackground from "./HeroBackground";
import HeroEffects from "./HeroEffects";
import HeroLogos from "./HeroLogos";
import HeroHeadline from "./HeroHeadline";
import HeroStory from "./HeroStory";
import HeroCTA from "./HeroCTA";
import HeroScroll from "./HeroScroll";
import HeroBleedThaBlock from "./HeroBleedThaBlock";

import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from("[data-hero='background']", {
        opacity: 0,
        scale: 1.03,
        duration: 1.6,
      })
        .from(
          "[data-hero='effects']",
          {
            opacity: 0,
            duration: 1.2,
          },
          "-=1.2",
        )
        .from(
          "[data-hero='logos']",
          {
            opacity: 0,
            y: 32,
            duration: 0.8,
          },
          "-=0.6",
        )
        .from(
          "[data-hero='headline']",
          {
            opacity: 0,
            y: 42,
            duration: 0.9,
          },
          "-=0.25",
        )
        .from(
          "[data-hero='story']",
          {
            opacity: 0,
            y: 30,
            duration: 0.9,
          },
          "-=0.15",
        )
        .from(
          "[data-hero='magic-link']",
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
          },
          "+=0.15",
        )
        .from(
          "[data-hero='cta']",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.3",
        )
        .from(
          "[data-hero='scroll']",
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
          },
          "-=0.15",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      {/* ============================================================ */}
      {/* BACKGROUND                                                     */}
      {/* ============================================================ */}

      <HeroBackground />

      {/* ============================================================ */}
      {/* CINEMATIC EFFECTS                                              */}
      {/* ============================================================ */}

      <HeroEffects />

      {/* ============================================================ */}
      {/* HERO CONTENT                                                   */}
      {/* ============================================================ */}

      <div className="relative z-20 flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-24 md:px-10">
          <div className="w-full">
            <div className="mx-auto max-w-4xl text-center">

              {/* ================================================== */}
              {/* RAPYARD LOGO                                        */}
              {/* ================================================== */}

              <div
                data-hero="logos"
                className="relative mx-auto flex justify-center"
              >
                <Image
                  src="/images/hero/logo.webp"
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
              </div>

              {/* ================================================== */}
              {/* EXISTING HERO LOGOS                                */}
              {/* ================================================== */}

              <div className="hidden">
                <HeroLogos />
              </div>

              {/* ================================================== */}
              {/* HEADLINE                                            */}
              {/* ================================================== */}

              <header
                data-hero="headline"
                className="mt-10"
              >
                <HeroHeadline />
              </header>

              {/* ================================================== */}
              {/* STORY                                               */}
              {/* ================================================== */}

              <section
                data-hero="story"
                className="mt-10"
              >
                <HeroStory />
              </section>

              {/* ================================================== */}
              {/* MAGIC LINK                                           */}
              {/* ================================================== */}

              <div
                data-hero="magic-link"
                className="
                  mt-12
                  mx-auto
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

              {/* ================================================== */}
              {/* CTA                                                  */}
              {/* ================================================== */}

              <footer
                data-hero="cta"
                className="mt-10"
              >
                <HeroCTA />
              </footer>
            </div>
          </div>
        </div>

        {/* ========================================================== */}
        {/* SCROLL                                                     */}
        {/* ========================================================== */}

        <div
          data-hero="scroll"
          className="relative z-20 pb-10"
        >
          <HeroScroll />
        </div>

        {/* ========================================================== */}
        {/* BLEED THA BLOCK LABEL                                      */}
        {/* ========================================================== */}

        <HeroBleedThaBlock />
      </div>

      {/* ============================================================ */}
      {/* BOTTOM FADE                                                   */}
      {/* ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-30
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