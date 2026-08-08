"use client";

import Image from "next/image";
import Link from "next/link";

const lanes = [
  {
    title: "RAPPER",
    description: "Write. Record. Perform.",
  },
  {
    title: "PRODUCER",
    description: "Build. Flip. Create.",
  },
  {
    title: "LISTENER",
    description: "Discover. Vote. Connect.",
  },
];

export default function OnboardingScreen() {
  return (
    <section
      className="
        relative
        min-h-[680px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#080a0c]
        shadow-[0_30px_120px_rgba(0,0,0,0.55)]
      "
    >
      {/* ============================================================
          CHROME / BLUE STEEL BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(125deg,rgba(255,255,255,0.075),transparent_28%,rgba(70,105,135,0.11)_55%,transparent_78%)]
          "
        />

        <div
          className="
            absolute
            -right-40
            -top-40
            h-[600px]
            w-[600px]
            rounded-full
            bg-blue-500/[0.08]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-orange-500/[0.06]
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.72)_100%)]
          "
        />
      </div>

      {/* ============================================================
          TOP BAR
      ============================================================ */}

      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-6
          py-5
          md:px-9
        "
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-black tracking-[0.35em] text-zinc-600">
            01
          </span>

          <span className="h-px w-8 bg-orange-500/60" />

          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-400">
            Start Here
          </span>
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
          RapYard
        </span>
      </div>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <div className="relative z-10 grid min-h-[620px] lg:grid-cols-[1fr_0.9fr]">
        {/* ----------------------------------------------------------
            COPY
        ---------------------------------------------------------- */}

        <div className="flex flex-col justify-center px-7 py-14 md:px-12 lg:px-16">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-300/70">
            Establish Your Identity
          </p>

          <h2
            className="
              mt-5
              max-w-xl
              text-6xl
              font-black
              uppercase
              leading-[0.82]
              tracking-[-0.04em]
              text-transparent
              [background:linear-gradient(180deg,#ffffff,#d8dde0_32%,#727b81_54%,#ffffff_74%,#737a7f)]
              bg-clip-text
              sm:text-7xl
              md:text-8xl
            "
          >
            CHOOSE
            <br />
            YOUR
            <br />
            LANE.
          </h2>

          <div className="mt-8 h-px w-36 bg-gradient-to-r from-orange-500 via-orange-400/40 to-transparent" />

          <p className="mt-7 max-w-lg text-sm leading-7 text-zinc-500 md:text-base">
            RapYard starts with who you are. Pick the lane that best represents
            how you move through the Yard.
          </p>

          {/* --------------------------------------------------------
              LANES
          -------------------------------------------------------- */}

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {lanes.map((lane) => (
              <div
                key={lane.title}
                className="
                  group
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-4
                  transition-all
                  duration-300
                  hover:border-orange-400/40
                  hover:bg-orange-500/[0.04]
                "
              >
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                    text-zinc-300
                    transition-colors
                    group-hover:text-orange-400
                  "
                >
                  {lane.title}
                </p>

                <p className="mt-2 text-[11px] leading-5 text-zinc-600">
                  {lane.description}
                </p>
              </div>
            ))}
          </div>

          {/* --------------------------------------------------------
              ACTION
          -------------------------------------------------------- */}

          <Link
            href="/rap-sheet"
            className="
              mt-9
              inline-flex
              w-fit
              items-center
              gap-5
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
              transition-all
              duration-300
              hover:border-orange-400
              hover:bg-orange-500/20
              hover:text-orange-200
            "
          >
            Enter Rap Sheet

            <span
              className="
                text-base
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>
        </div>

        {/* ----------------------------------------------------------
            RAPYARD ARTWORK
        ---------------------------------------------------------- */}

        <div className="relative min-h-[420px] overflow-hidden lg:min-h-0">
          <Image
            src="/images/yard/rapyard-mascot.webp"
            alt="RapYard"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="
              object-cover
              object-center
              transition-transform
              duration-1000
              hover:scale-[1.025]
            "
          />

          {/* Left fade */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#080a0c]
              via-[#080a0c]/35
              to-transparent
            "
          />

          {/* Bottom fade */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#080a0c]
              via-transparent
              to-black/20
            "
          />

          {/* Blue steel overlay */}
          <div className="absolute inset-0 bg-blue-500/[0.035] mix-blend-screen" />

          {/* Artwork label */}
          <div className="absolute bottom-7 right-7 z-10">
            <div className="rounded-lg border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                RAPYARD
              </p>

              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">
                Identity Starts Here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM METAL LINE
      ============================================================ */}

      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
    </section>
  );
}