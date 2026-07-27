"use client";

import {
  Mic2,
  Disc3,
  Trophy,
  Users,
  Radio,
  Music4,
} from "lucide-react";

const districts = [
  {
    icon: Mic2,
    title: "Recording Booth",
    description:
      "Record vocals, save sessions, and build songs directly inside RapYard.",
  },
  {
    icon: Disc3,
    title: "Beat Yard",
    description:
      "Browse beats, connect with producers, and license instrumentals.",
  },
  {
    icon: Trophy,
    title: "Battle Arena",
    description:
      "Compete in rap battles, challenges, and seasonal competitions.",
  },
  {
    icon: Users,
    title: "The Yard",
    description:
      "Share music, discover artists, and build your community.",
  },
  {
    icon: Radio,
    title: "Live Cyphers",
    description:
      "Jump into live sessions and collaborate with creators in real time.",
  },
  {
    icon: Music4,
    title: "Release Center",
    description:
      "Publish tracks and manage your catalog from one dashboard.",
  },
];

export default function Districts() {
  return (
    <section
      id="districts"
      className="bg-black py-32 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.45em] text-orange-400">
            DISTRICTS
          </span>

          <h2 className="mt-6 text-4xl font-black uppercase md:text-6xl">
            Everything You Need.
            <br />
            One Platform.
          </h2>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            Every part of RapYard is designed around creators—not algorithms.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {districts.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="
                group
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-8
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-orange-500/40
                hover:-translate-y-1
                hover:shadow-[0_0_35px_rgba(255,120,20,.12)]
              "
            >
              <div className="mb-6 inline-flex rounded-2xl bg-orange-500/15 p-4 text-orange-400">
                <Icon size={30} />
              </div>

              <h3 className="text-2xl font-bold">{title}</h3>

              <p className="mt-4 leading-7 text-zinc-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}