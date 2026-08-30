"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

import HeroBackground from "./HeroBackground";
import HeroEffects from "./HeroEffects";
import MagicLinkFloatingButton from "./MagicLinkFloatingButton";

export default function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero='background']", {
        opacity: 0,
        scale: 1.03,
        duration: 1.6,
        ease: "power3.out",
      });

      gsap.from("[data-hero='effects']", {
        opacity: 0,
        duration: 1.2,
        delay: 0.35,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative isolate min-h-screen overflow-hidden bg-black text-white"
    >
      <HeroBackground />

      <HeroEffects />

      <div className="relative z-20 min-h-screen">
        <MagicLinkFloatingButton />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}