import Reveal from "@/components/motion/Reveal";

const pillars = [
  {
    title: "Create",
    description:
      "Record songs, capture ideas, and build your catalog from one creative workspace.",
  },
  {
    title: "Collaborate",
    description:
      "Work with producers, artists, engineers, and creators who are building alongside you.",
  },
  {
    title: "Compete",
    description:
      "Step into battles, challenges, and community events that put your music in front of listeners.",
  },
];

export default function Forge() {
  return (
    <section
      id="forge"
      aria-labelledby="forge-heading"
      className="relative overflow-hidden bg-zinc-950 py-36 text-white"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[240px]" />

        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:42px_42px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <Reveal>

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-orange-400">
              THE FORGE
            </p>

            <h2
              id="forge-heading"
              className="chrome-text mt-6 text-5xl font-black leading-tight md:text-7xl"
            >
              Build your music.
              <br />
              Build your legacy.
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-zinc-400">
              RapYard is where artists create, collaborate, compete, and grow.
              Every session becomes part of your story.
            </p>

            {/* Motto */}

            <div className="mt-12 flex items-center gap-5">

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

              <div className="hero-motto">

                <p className="text-xs uppercase tracking-[0.45em] text-orange-300">
                  Respect Isn't Earned.
                </p>

                <p className="chrome-text mt-2 text-2xl font-black uppercase tracking-[0.22em]">
                  It's Recorded.
                </p>

              </div>

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            </div>

          </div>

        </Reveal>

        {/* Divider */}

        <div className="mx-auto mt-20 h-px max-w-5xl bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />

        {/* Cards */}

        <div className="mt-20 grid gap-8 lg:grid-cols-3">

          {pillars.map((pillar, index) => (

            <Reveal key={pillar.title} delay={index * 150}>

              <article
                className="
                  glass
                  hover-lift
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/5
                  p-8
                "
              >

                {/* Glow */}

                <div className="absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100">

                  <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/12 blur-3xl" />

                </div>

                {/* Number */}

                <div className="relative mb-8 text-6xl font-black text-zinc-800 transition duration-500 group-hover:text-orange-500/20">

                  0{index + 1}

                </div>

                {/* Accent */}

                <div className="relative mb-6 h-[3px] w-16 rounded-full bg-orange-500 transition-all duration-500 group-hover:w-28" />

                <h3 className="relative text-3xl font-bold transition duration-300 group-hover:text-orange-300">

                  {pillar.title}

                </h3>

                <p className="relative mt-6 leading-8 text-zinc-400">

                  {pillar.description}

                </p>

              </article>

            </Reveal>

          ))}

        </div>

        {/* Bottom CTA */}

        <Reveal delay={350}>

          <div className="mt-28 text-center">

            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">

              THE JOURNEY CONTINUES

            </p>

            <h3 className="chrome-text mt-4 text-4xl font-black md:text-5xl">

              Discover the Districts.

            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-zinc-400">

              Every district inside RapYard is built to help artists create,
              connect, compete, and leave a lasting mark.

            </p>

          </div>

        </Reveal>

      </div>
    </section>
  );
}