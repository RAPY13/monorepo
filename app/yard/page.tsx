"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

const features = [
  {
    title: "Record",
    description: "Capture vocals and start your next session.",
    icon: "🎙️",
  },
  {
    title: "Discover",
    description: "Find artists, beats, and new music.",
    icon: "🎵",
  },
  {
    title: "Connect",
    description: "Build your crew and collaborate.",
    icon: "🤝",
  },
  {
    title: "Compete",
    description: "Enter battles and earn your reputation.",
    icon: "🔥",
  },
];

export default function YardPage() {
  const gateRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [opening, setOpening] = useState(false);

  const openGate = () => {
    if (opening) return;

    setOpening(true);

    gsap.to(".yard-gate", {
      y: "-100%",
      duration: 1.4,
      ease: "power4.inOut",
      onComplete: () => {
        setRevealed(true);

        gsap.from(".yard-card", {
          opacity: 0,
          y: 50,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });

        gsap.from(".yard-title", {
          opacity: 0,
          y: 25,
          duration: 0.9,
          ease: "power3.out",
        });
      },
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black" />

      {/* Gate Overlay */}
      <div
        ref={gateRef}
        className="yard-gate absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
      >
        <h1 className="text-5xl font-black uppercase tracking-[0.25em] md:text-7xl">
          YARDGATE
        </h1>

        <p className="mt-6 max-w-md text-center text-zinc-400">
          Welcome to RapYard.
          <br />
          Step inside.
        </p>

        <button
          onClick={openGate}
          disabled={opening}
          className="
            mt-12
            rounded-full
            border
            border-[#5B7FFF]
            bg-[#5B7FFF]
            px-8
            py-4
            font-bold
            uppercase
            tracking-[0.2em]
            transition
            hover:scale-105
            hover:bg-[#6F8CFF]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {opening ? "Opening..." : "Open The Yard"}
        </button>
      </div>

      {/* Main Content */}
      {revealed && (
        <div className="relative z-10 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="yard-title text-center">
              <h2 className="text-5xl font-black uppercase tracking-tight">
                Welcome to the Yard
              </h2>

              <p className="mt-5 text-lg text-slate-400">
                Built for the Culture.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="
                    yard-card
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-8
                    backdrop-blur-xl
                    transition
                    hover:-translate-y-1
                    hover:border-[#5B7FFF]/40
                    hover:shadow-[0_0_30px_rgba(91,127,255,.15)]
                  "
                >
                  <div className="mb-6 text-5xl">{feature.icon}</div>

                  <h3 className="text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}