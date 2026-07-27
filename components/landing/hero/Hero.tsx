"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import HeroBackground from "./HeroBackground";
import HeroEffects from "./HeroEffects";
import HeroLogos from "./HeroLogos";
import HeroHeadline from "./HeroHeadline";
import HeroStory from "./HeroStory";
import HeroCTA from "./HeroCTA";
import HeroScroll from "./HeroScroll";

import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl
        .from("[data-hero='background']", {
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
          "-=1.2"
        )

        .from(
          "[data-hero='logos']",
          {
            opacity: 0,
            y: 32,
            duration: 0.8,
          },
          "-=0.6"
        )

        .from(
          "[data-hero='headline']",
          {
            opacity: 0,
            y: 42,
            duration: 0.9,
          },
          "-=0.25"
        )

        .from(
          "[data-hero='story']",
          {
            opacity: 0,
            y: 30,
            duration: 0.9,
          },
          "-=0.15"
        )

        .from(
          "[data-hero='magic-link']",
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
          },
          "+=0.15"
        )

        .from(
          "[data-hero='cta']",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.3"
        )

        .from(
          "[data-hero='scroll']",
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
          },
          "-=0.15"
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
      {/* Background */}
      <HeroBackground />

      {/* Atmosphere */}
      <HeroEffects />

      {/* Main Content */}
      <div className="relative z-20 flex min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pt-24 pb-16 md:px-10">
          <div className="w-full">
            <div className="mx-auto max-w-4xl text-center">

              <HeroLogos />

              <header className="mt-10">
                <HeroHeadline />
              </header>

              <section className="mt-10">
                <HeroStory />
              </section>

              {/* Magic Link Authentication */}
              <div
                data-hero="magic-link"
                className="mt-12"
              >
                <MagicLinkForm />
              </div>

              {/* Supporting CTA / Founder messaging */}
              <footer
                data-hero="cta"
                className="mt-10"
              >
                <HeroCTA />
              </footer>

            </div>
          </div>
        </div>

        <div className="relative z-20 pb-10">
          <HeroScroll />
        </div>
      </div>
    </section>
  );
}