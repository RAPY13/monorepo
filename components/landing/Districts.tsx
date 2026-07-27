import {
  ArrowRight,
  Globe2,
  Mic2,
  Music4,
  Swords,
} from "lucide-react";

import Reveal from "@/components/motion/Reveal";

const districts = [
  {
    icon: Mic2,
    number: "01",
    label: "Studio",
    title: "Recording Booth",
    description:
      "Record ideas, verses, hooks, and complete songs directly inside RapYard.",
  },
  {
    icon: Music4,
    number: "02",
    label: "Marketplace",
    title: "Beat Discovery",
    description:
      "Browse beats, connect with producers, and discover the sound that fits your style.",
  },
  {
    icon: Swords,
    number: "03",
    label: "Competition",
    title: "Battle Arena",
    description:
      "Challenge artists, join community events, and let listeners decide the winner.",
  },
  {
    icon: Globe2,
    number: "04",
    label: "Community",
    title: "The Yard",
    description:
      "Share releases, build your audience, discover creators, and grow your network.",
  },
];

export default function Districts() {
  return (
    <section
      id="districts"
      aria-labelledby="districts-heading"
      className="relative overflow-hidden bg-black py-36 text-white"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[750px] w-[750px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[240px]" />

        <div className="absolute bottom-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[200px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}

        <Reveal>

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-orange-400">
              DISTRICTS
            </p>

            <h2
              id="districts-heading"
              className="chrome-text mt-6 text-5xl font-black leading-tight md:text-7xl"
            >
              Explore the Yard.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
              Every district inside RapYard has a purpose. Move between creative
              spaces built to help artists record, collaborate, compete, and
              grow without leaving the platform.
            </p>

          </div>

        </Reveal>

        <div className="mx-auto mt-20 h-px max-w-5xl bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {districts.map((district, index) => {

            const Icon = district.icon;

            return (

              <Reveal key={district.title} delay={index * 120}>

                <article
                  className="
                    glass
                    hover-lift
                    group
                    relative
                    flex
                    h-full
                    flex-col
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/5
                    p-8
                  "
                >

                  {/* Hover Glow */}

                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">

                    <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />

                  </div>

                  {/* Top Accent */}

                  <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 transition duration-500 group-hover:scale-x-100" />

                  <div className="relative flex flex-1 flex-col">

                    {/* Number */}

                    <span className="text-6xl font-black text-zinc-800 transition duration-300 group-hover:text-orange-500/20">
                      {district.number}
                    </span>

                    {/* Icon */}

                    <Icon className="mt-6 h-12 w-12 text-orange-400 transition duration-500 group-hover:scale-110 group-hover:rotate-3" />

                    {/* Label */}

                    <span className="mt-6 text-xs uppercase tracking-[0.3em] text-orange-300">
                      {district.label}
                    </span>

                    {/* Title */}

                    <h3 className="mt-3 text-2xl font-bold transition duration-300 group-hover:text-orange-300">
                      {district.title}
                    </h3>

                    {/* Divider */}

                    <div className="mt-6 h-[3px] w-14 rounded-full bg-orange-500 transition duration-500 group-hover:w-24" />

                    {/* Description */}

                    <p className="mt-6 flex-1 leading-8 text-zinc-400">
                      {district.description}
                    </p>

                    {/* Footer */}

                    <div className="mt-10 flex items-center justify-between">

                      <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                        District
                      </span>

                      <ArrowRight className="h-5 w-5 text-orange-400 transition duration-300 group-hover:translate-x-2" />

                    </div>

                  </div>

                </article>

              </Reveal>

            );

          })}

        </div>

        {/* Bottom CTA */}

        <Reveal delay={500}>

          <div className="mt-28 text-center">

            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              YOUR JOURNEY STARTS HERE
            </p>

            <h3 className="chrome-text mt-4 text-4xl font-black md:text-5xl">
              Build your legacy.
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-zinc-400">
              Every recording, collaboration, battle, and release becomes part
              of your story.
            </p>

          </div>

        </Reveal>

      </div>
    </section>
  );
}