"use client";

import Link from "next/link";
import YardCard from "@/components/yard/YardCard";
import YardFlowScreens from "@/components/yard/YardFlowScreens";

const openCards = [
  {
    title: "THE BOOTH",
    subtitle: "CREATE",
    description:
      "Step inside. Pick a beat, record your take, and build something worth keeping.",
    href: "/booth",
  },
  {
    title: "BEAT YARD",
    subtitle: "DISCOVER",
    description:
      "Find beats, sounds, and production made for artists inside the Yard.",
    href: "/beats",
  },
  {
    title: "ARTISTS",
    subtitle: "DISCOVER",
    description:
      "Find artists, creators, and voices moving through RapYard.",
    href: "/artists",
  },
  {
    title: "YARD FEED",
    subtitle: "LIVE",
    description:
      "See what's being created, dropped, battled, and shared across the Yard.",
    href: "/feed",
  },
];

export default function YardHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ============================================================
          ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            left-1/2
            top-[-220px]
            h-[650px]
            w-[1000px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/[0.06]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            left-[-150px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-orange-500/[0.055]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-200px]
            top-[35%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-400/[0.035]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]
          "
        />
      </div>

      {/* ============================================================
          YARD HEADER
      ============================================================ */}

      <header
        className="
          relative
          z-20
          border-b
          border-white/10
          bg-black/50
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            px-6
            py-5
            md:px-10
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.45em]
                text-orange-400
              "
            >
              RAPYARD
            </p>

            <h1
              className="
                mt-1
                text-3xl
                font-black
                uppercase
                leading-none
                tracking-tight
                text-transparent
                [background:linear-gradient(180deg,#fff,#cfd4d7_35%,#697278_55%,#fff_75%,#737a7f)]
                bg-clip-text
                md:text-4xl
              "
            >
              THE YARD
            </h1>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-orange-400
                shadow-[0_0_12px_rgba(251,146,60,0.8)]
              "
            />

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              You're inside
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative z-10">
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            pb-20
            pt-20
            md:px-10
            md:pb-28
            md:pt-28
          "
        >
          <div className="max-w-4xl">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.45em]
                text-orange-400
              "
            >
              Welcome to the Yard
            </p>

            <h2
              className="
                mt-5
                text-6xl
                font-black
                uppercase
                leading-[0.82]
                tracking-[-0.04em]
                text-transparent
                [background:linear-gradient(180deg,#ffffff,#d9dddf_30%,#717a80_53%,#ffffff_72%,#737b80)]
                bg-clip-text
                sm:text-7xl
                md:text-8xl
              "
            >
              MAKE
              <br />
              NOISE.
            </h2>

            <div
              className="
                mt-8
                h-px
                w-40
                bg-gradient-to-r
                from-orange-500
                via-orange-400/50
                to-transparent
              "
            />

            <p
              className="
                mt-7
                max-w-2xl
                text-base
                leading-8
                text-zinc-500
                md:text-lg
              "
            >
              This is where the work lives. Record. Discover. Connect.
              Compete. Build your name inside RapYard.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          OPEN NOW
      ============================================================ */}

      <section className="relative z-10">
        <div
          className="
            mx-auto
            max-w-7xl
            px-6
            pb-24
            md:px-10
          "
        >
          <div className="mb-10">
            <div className="flex items-center gap-4">
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.4em]
                  text-orange-400
                "
              >
                Open Now
              </p>

              <div
                className="
                  h-px
                  flex-1
                  bg-gradient-to-r
                  from-orange-500/40
                  to-transparent
                "
              />
            </div>

            <p className="mt-3 text-sm text-zinc-600">
              What's available inside the Yard right now.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {openCards.map((card) => (
              <YardCard
                key={card.title}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ORIGINAL RAPYARD FLOW
      ============================================================ */}

      <YardFlowScreens />

      {/* ============================================================
          FINAL CTA
      ============================================================ */}

      <section className="relative z-10 border-t border-white/10">
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            px-6
            py-24
            text-center
            md:px-10
          "
        >
          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.45em]
              text-zinc-700
            "
          >
            RAPYARD
          </p>

          <h3
            className="
              mt-5
              text-4xl
              font-black
              uppercase
              tracking-tight
              text-transparent
              [background:linear-gradient(180deg,#fff,#bfc5c8_40%,#697177_60%,#fff)]
              bg-clip-text
              md:text-6xl
            "
          >
            THE YARD IS OPEN.
          </h3>

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-zinc-600
            "
          >
            Build your profile. Find your sound. Step into the booth.
          </p>

          <Link
            href="/booth"
            className="
              mt-8
              inline-flex
              items-center
              gap-4
              rounded-full
              border
              border-orange-400/40
              bg-orange-500/10
              px-7
              py-4
              text-[10px]
              font-black
              uppercase
              tracking-[0.3em]
              text-orange-300
              transition
              hover:border-orange-400
              hover:bg-orange-500/20
              hover:text-orange-200
            "
          >
            Enter The Booth

            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}