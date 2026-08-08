"use client";

import Image from "next/image";
import Link from "next/link";

const yardActivity = [
  {
    label: "LIVE CYPHERS",
    value: "01",
    status: "LIVE",
  },
  {
    label: "NEW UPLOADS",
    value: "24",
    status: "TODAY",
  },
  {
    label: "BATTLES",
    value: "08",
    status: "ACTIVE",
  },
  {
    label: "BEAT DROPS",
    value: "16",
    status: "NEW",
  },
];

export default function YardScreen() {
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
          ATMOSPHERE
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
          <span
            className="
              text-xs
              font-black
              tracking-[0.35em]
              text-zinc-600
            "
          >
            02
          </span>

          <span className="h-px w-8 bg-orange-500/60" />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.35em]
              text-orange-400
            "
          >
            Home Base
          </span>
        </div>

        <span
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.3em]
            text-zinc-700
          "
        >
          The Yard
        </span>
      </div>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <div className="relative z-10 grid min-h-[620px] lg:grid-cols-[1fr_0.9fr]">
        {/* ==========================================================
            COPY / ACTIVITY
        ========================================================== */}

        <div
          className="
            flex
            flex-col
            justify-center
            px-7
            py-14
            md:px-12
            lg:px-16
          "
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.4em]
              text-blue-300/70
            "
          >
            Your Home Inside RapYard
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
            THE
            <br />
            YARD.
          </h2>

          <div
            className="
              mt-8
              h-px
              w-36
              bg-gradient-to-r
              from-orange-500
              via-orange-400/40
              to-transparent
            "
          />

          <p
            className="
              mt-7
              max-w-lg
              text-sm
              leading-7
              text-zinc-500
              md:text-base
            "
          >
            The place where everything moving through RapYard comes together.
            Discover artists, new uploads, battles, beats, and activity across
            the Yard.
          </p>

          {/* ========================================================
              ACTIVITY GRID
          ======================================================== */}

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
            {yardActivity.map((item) => (
              <div
                key={item.label}
                className="
                  group
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-4
                  transition-all
                  duration-300
                  hover:border-orange-400/30
                  hover:bg-orange-500/[0.035]
                "
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-zinc-500
                    "
                  >
                    {item.label}
                  </span>

                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-orange-400
                      opacity-60
                      transition
                      group-hover:opacity-100
                    "
                  />
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <span
                    className="
                      text-2xl
                      font-black
                      tracking-tight
                      text-zinc-200
                    "
                  >
                    {item.value}
                  </span>

                  <span
                    className="
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-zinc-700
                    "
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              ACTION
          ======================================================== */}

          <Link
            href="/yard"
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
            Explore The Yard

            <span
              aria-hidden="true"
              className="text-base"
            >
              →
            </span>
          </Link>
        </div>

        {/* ==========================================================
            RAPYARD ARTWORK
        ========================================================== */}

        <div
          className="
            relative
            min-h-[430px]
            overflow-hidden
            lg:min-h-0
          "
        >
          <Image
            src="/images/yard/rapyard-mascot.webp"
            alt="RapYard mascot"
            fill
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
              via-[#080a0c]/30
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

          {/* Blue steel */}
          <div className="absolute inset-0 bg-blue-500/[0.035] mix-blend-screen" />

          {/* Activity badge */}
          <div
            className="
              absolute
              right-7
              top-7
              z-10
              rounded-lg
              border
              border-orange-400/20
              bg-black/55
              px-4
              py-3
              backdrop-blur-md
            "
          >
            <div className="flex items-center gap-2">
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-orange-400
                  shadow-[0_0_10px_rgba(251,146,60,0.8)]
                "
              />

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-orange-300
                "
              >
                Yard Active
              </span>
            </div>
          </div>

          {/* Artwork label */}
          <div
            className="
              absolute
              bottom-7
              right-7
              z-10
              rounded-lg
              border
              border-white/10
              bg-black/55
              px-4
              py-3
              backdrop-blur-md
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.3em]
                text-zinc-600
              "
            >
              RAPYARD
            </p>

            <p
              className="
                mt-1
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]
                text-zinc-300
              "
            >
              Home Base
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM METAL LINE
      ============================================================ */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          h-px
          bg-gradient-to-r
          from-transparent
          via-orange-500/50
          to-transparent
        "
      />
    </section>
  );
}