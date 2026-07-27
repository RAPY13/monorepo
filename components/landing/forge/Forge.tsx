"use client";

import { Hammer, Music4, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: Hammer,
    title: "Build",
    description:
      "Create music, organize projects, and develop your catalog from one platform.",
  },
  {
    icon: Music4,
    title: "Release",
    description:
      "Publish tracks, connect with listeners, and grow your audience without giving up ownership.",
  },
  {
    icon: ShieldCheck,
    title: "Own",
    description:
      "Your music. Your identity. Your future. RapYard is built around creator ownership.",
  },
];

export default function Forge() {
  return (
    <section
      id="forge"
      className="relative overflow-hidden bg-zinc-950 py-32 text-white"
    >
      {/* Background Glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,120,20,.12), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.45em] text-orange-400">
            THE FORGE
          </span>

          <h2 className="mt-6 text-4xl font-black uppercase md:text-6xl">
            Built For Independent Artists
          </h2>

          <p className="mt-8 text-lg leading-8 text-zinc-400">
            RapYard isn't just another music platform.
            It's where artists create, collaborate,
            compete, and own what they build.
          </p>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="
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
              "
            >
              <div className="mb-6 inline-flex rounded-2xl bg-orange-500/15 p-4 text-orange-400">
                <Icon size={30} />
              </div>

              <h3 className="text-2xl font-bold">{title}</h3>

              <p className="mt-4 leading-7 text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}