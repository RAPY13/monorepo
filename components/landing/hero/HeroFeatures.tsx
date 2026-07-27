"use client";

import { Mic2, Users, Trophy } from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Create",
    description: "Record vocals, discover beats, and produce tracks in one place.",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Connect with artists, producers, and engineers across the Yard.",
  },
  {
    icon: Trophy,
    title: "Compete",
    description: "Join battles, build your reputation, and earn real recognition.",
  },
];

export default function HeroFeatures() {
  return (
    <div
      data-hero="features"
      className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3"
    >
      {features.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          data-hero-card
          className="
            group
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-6
            backdrop-blur-md
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-orange-500/60
            hover:bg-white/10
            hover:shadow-[0_0_35px_rgba(255,120,20,.18)]
          "
        >
          <div className="mb-5 flex justify-center">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-orange-500/15
                text-orange-400
                transition-transform
                duration-300
                group-hover:scale-110
              "
            >
              <Icon size={28} strokeWidth={2.2} />
            </div>
          </div>

          <h3 className="text-center text-xl font-bold uppercase tracking-wide text-white">
            {title}
          </h3>

          <p className="mt-3 text-center text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}