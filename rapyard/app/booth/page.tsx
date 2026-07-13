"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RequireRole } from "@/app/components/RequireRole";
import { BeatPlayer } from "@/app/components/BeatPlayer";

gsap.registerPlugin(ScrollTrigger);

interface Beat {
  id: string;
  name: string;
  bpm: number;
  vibe: string;
  audioUrl?: string; // Mock URL - in production, use actual Supabase storage URLs
}

const BEATS: Beat[] = [
  {
    id: "beat_1",
    name: "Grindhouse",
    bpm: 88,
    vibe: "Dark & Heavy",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "beat_2",
    name: "Steelworks",
    bpm: 140,
    vibe: "Aggressive",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "beat_3",
    name: "Nightshift",
    bpm: 110,
    vibe: "Hypnotic",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "beat_4",
    name: "Concrete Jungle",
    bpm: 95,
    vibe: "Street",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "beat_5",
    name: "Neon Pulse",
    bpm: 120,
    vibe: "Synth",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "beat_6",
    name: "Industrial",
    bpm: 105,
    vibe: "Raw",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];

export default function BoothPage() {
  const yardRef = useRef<HTMLDivElement | null>(null);
  const yardBgRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [expandedBeat, setExpandedBeat] = useState<string | null>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.from(titleRef.current, { opacity: 0, y: 40, duration: 0.8 });
    }
  }, []);

  useEffect(() => {
    if (yardBgRef.current) {
      gsap.to(yardBgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: yardBgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <RequireRole>
      <div
        ref={yardRef}
        className="relative min-h-screen bg-black text-white p-10 overflow-hidden pb-20"
      >
        {/* Parallax background */}
        <div
          ref={yardBgRef}
          className="fixed inset-0 top-0 bg-gradient-to-b from-gray-900/20 to-black opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div ref={titleRef} className="text-center space-y-2 mb-12">
            <p className="tracking-[0.3em] text-xs text-gray-400">CHAMBER THREE</p>
            <h1 className="text-5xl font-black tracking-wide">THE YARD</h1>
            <p className="text-sm text-gray-400">Industrial crates. Curated beats. Build your arsenal.</p>
          </div>

          {/* Beats Grid */}
          <div className="space-y-4">
            {BEATS.map((beat) => (
              <div
                key={beat.id}
                className="border border-gray-700 rounded-lg bg-black/40 backdrop-blur-sm transition-all duration-300 overflow-hidden"
              >
                {/* Beat Header */}
                <button
                  onClick={() =>
                    setExpandedBeat(expandedBeat === beat.id ? null : beat.id)
                  }
                  className="w-full p-6 hover:bg-black/60 transition-colors flex items-center justify-between"
                >
                  <div className="text-left flex-grow">
                    <h3 className="text-lg font-bold text-white">
                      {beat.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{beat.vibe}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-2xl font-black text-yellow-500">
                      {beat.bpm}
                    </p>
                    <p className="text-xs text-gray-600">BPM</p>
                  </div>
                  <div className="text-yellow-400 text-xl">
                    {expandedBeat === beat.id ? "▼" : "▶"}
                  </div>
                </button>

                {/* Expandable Player */}
                {expandedBeat === beat.id && beat.audioUrl && (
                  <div className="border-t border-gray-800 p-6 bg-black/80">
                    <BeatPlayer
                      beatId={beat.id}
                      beatName={beat.name}
                      audioUrl={beat.audioUrl}
                      bpm={beat.bpm}
                    />
                    <button className="w-full mt-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-[0.2em] rounded transition-colors">
                      → ADD TO SESSION
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer message */}
          <div className="mt-12 text-center space-y-2 text-sm text-gray-500">
            <p>Each beat tested. Tight loops. Ready to go.</p>
            <p>Pick one. Layer up. Make it yours.</p>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
