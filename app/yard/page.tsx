"use client";

import { useState } from "react";
import { gsap } from "gsap";

export default function YardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [cardsUnlocked, setCardsUnlocked] = useState(0);

  const unlockNextCard = () => {
    if (cardsUnlocked >= 4) return;

    const next = cardsUnlocked + 1;
    setCardsUnlocked(next);

    gsap.fromTo(
      `.card-${next}`,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    if (next === 4) {
      gsap.to(".yard-gate", {
        y: -300,
        opacity: 0,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => setUnlocked(true),
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">

      {/* YardGate */}
      <div className="yard-gate absolute inset-0 flex items-center justify-center bg-neutral-900">
        <h1 className="text-5xl font-bold tracking-wide">YARDGATE</h1>

        <button
          onClick={unlockNextCard}
          className="absolute bottom-20 px-6 py-3 bg-green-600 rounded-xl font-bold hover:bg-green-500"
        >
          Unlock Next
        </button>
      </div>

      {/* Cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 pointer-events-none">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`card-${i} w-64 h-40 bg-neutral-800 rounded-xl flex items-center justify-center text-xl font-bold opacity-0`}
          >
            Card {i}
          </div>
        ))}
      </div>

      {/* Yard Reveal */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-black flex items-center justify-center">
          <h1 className="text-6xl font-extrabold">WELCOME TO THE YARD</h1>
        </div>
      )}
    </div>
  );
}
