import {
  ArrowRight,
  Mic2,
  Music4,
  Swords,
  TrendingUp,
} from "lucide-react";

import Reveal from "@/components/motion/Reveal";

const steps = [
  {
    icon: Mic2,
    number: "01",
    title: "Create",
    description:
      "Record songs, freestyle ideas, hooks, and demos directly inside RapYard.",
  },
  {
    icon: Music4,
    number: "02",
    title: "Discover",
    description:
      "Find beats, producers, collaborators, and inspiration from the community.",
  },
  {
    icon: Swords,
    number: "03",
    title: "Compete",
    description:
      "Join battles, cyphers, showcases, and community events that put your music in front of listeners.",
  },
  {
    icon: TrendingUp,
    number: "04",
    title: "Grow",
    description:
      "Build your audience, release music, and create lasting connections that move your career forward.",
  },
];

export default function CreatorJourney() {
  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="relative overflow-hidden bg-zinc-950 py-36 text-white"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/8 blur-[220px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}

        <Reveal>

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-orange-400">
              YOUR JOURNEY
            </p>

            <h2
              id="journey-heading"
              className="chrome-text mt-6 text-5xl font-black leading-tight md:text-7xl"
            >
              From your first verse
              <br />
              to your legacy.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
              Every creator starts somewhere. RapYard gives you the tools,
              community, and opportunities to grow with every recording,
              collaboration, and release.
            </p>

          </div>

        </Reveal>

        {/* Journey */}

        <div className="mt-24 grid gap-12 lg:grid-cols-4">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <Reveal key={step.title} delay={index * 120}>

                <article className="group relative text-center">

                  {/* Step Number */}

                  <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/5 text-sm font-bold tracking-[0.2em] text-orange-300">
                    {step.number}
                  </div>

                  {/* Icon */}

                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 transition duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/15">

                    <Icon className="h-10 w-10 text-orange-400 transition duration-300 group-hover:scale-110" />

                  </div>

                  {/* Title */}

                  <h3 className="mt-8 text-2xl font-bold">
                    {step.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-5 leading-8 text-zinc-400">
                    {step.description}
                  </p>

                  {/* Connector */}

                  {index < steps.length - 1 && (

                    <div className="absolute right-[-36px] top-[95px] hidden lg:flex items-center">

                      <ArrowRight className="h-6 w-6 text-orange-500/50" />

                    </div>

                  )}

                </article>

              </Reveal>

            );

          })}

        </div>

        {/* Closing Statement */}

        <Reveal delay={500}>

          <div className="mx-auto mt-28 max-w-3xl text-center">

            <div className="mx-auto mb-8 h-px w-40 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">
              Every session leaves a legacy.
            </p>

            <h3 className="chrome-text mt-6 text-4xl font-black md:text-5xl">
              Respect isn't earned.
              <br />
              It's recorded.
            </h3>

          </div>

        </Reveal>

      </div>
    </section>
  );
}