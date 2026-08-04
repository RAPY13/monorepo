"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * /gate-bg
 *
 * Ambient background-only version of the gate scene.
 * Renders the glow, fog and spark layers in a looping animation
 * with no interactive UI — suitable for use as a visual backdrop
 * or iframe embed behind other surfaces.
 */
export default function GateBgPage() {
  const glow = useRef<HTMLDivElement | null>(null);
  const fog = useRef<HTMLDivElement | null>(null);
  const spark = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      repeat: -1,
      yoyo: true,
    });

    tl.to(glow.current, { opacity: 0.9, scale: 1.12, duration: 3.5 })
      .to(fog.current, { opacity: 0.7, y: -24, duration: 3 }, "<0.5")
      .to(
        spark.current,
        { opacity: 0.85, scale: 1.08, duration: 1.6, yoyo: true, repeat: 1 },
        "<0.5"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#050505]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={glow}
          className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px]"
        />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-red-500/15 blur-[140px]" />
        <div
          ref={fog}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.18),transparent_40%)]"
        />
        <div
          ref={spark}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,208,120,0.22),transparent_30%)]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,180,75,0.14),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_50%)]" />
      </div>
    </div>
  );
}
