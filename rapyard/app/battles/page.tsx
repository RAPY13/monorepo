"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { RequireRole } from "@/app/components/RequireRole";

export default function BattleRoom() {
  const pitRef = useRef<HTMLDivElement | null>(null);
  const vsRef = useRef<HTMLDivElement | null>(null);
  const startBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(pitRef.current, { opacity: 0, y: 40, duration: 0.8 })
      .from(vsRef.current, { scale: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4")
      .from(startBtnRef.current, { opacity: 0, y: 20, duration: 0.6 }, "-=0.2");
  }, []);

  return (
    <RequireRole>
      <div
        ref={pitRef}
        className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center"
      >
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-2">
            <p className="tracking-[0.3em] text-xs text-gray-400">CHAMBER TWO</p>
            <h1 className="text-5xl font-black tracking-wide">THE PIT</h1>
            <p className="text-sm text-gray-400">Underground. Unfiltered. Unchained.</p>
          </div>

          {/* Battle arena */}
          <div className="space-y-8">
            {/* Flickering effect background */}
            <div className="absolute inset-0 opacity-5 bg-red-600 animate-pulse pointer-events-none" />

            <div className="relative grid grid-cols-3 items-center text-center gap-6">
              {/* Left side */}
              <div className="border-l-4 border-yellow-500 pl-6 text-left">
                <p className="text-xs text-gray-400 tracking-[0.2em]">CHALLENGER</p>
                <h2 className="text-2xl font-black text-yellow-400 mt-2">YOU</h2>
              </div>

              {/* Center VS */}
              <div ref={vsRef} className="text-center">
                <div className="text-5xl font-black text-red-500 drop-shadow-lg">VS</div>
                <p className="text-xs text-gray-500 mt-2 tracking-[0.1em]">1v1</p>
              </div>

              {/* Right side */}
              <div className="border-r-4 border-red-500 pr-6 text-right">
                <p className="text-xs text-gray-400 tracking-[0.2em]">OPPONENT</p>
                <h2 className="text-2xl font-black text-red-400 mt-2">WAITING</h2>
              </div>
            </div>

            {/* Battle info */}
            <div className="border border-gray-800 rounded p-6 bg-black/60 backdrop-blur-sm space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Rounds:</span> 3 x 16
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Format:</span> Head-to-head cipher
              </p>
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Stakes:</span> Respect, bars, bragging rights
              </p>
            </div>
          </div>

          {/* Start button */}
          <button
            ref={startBtnRef}
            className="w-full py-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-xl font-black tracking-wider transition-colors shadow-lg shadow-yellow-500/50"
          >
            START ROUND
          </button>

          <div className="text-center space-y-2 text-xs text-gray-500">
            <p>Step in. No backing out.</p>
            <p>Let the best bars win.</p>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
