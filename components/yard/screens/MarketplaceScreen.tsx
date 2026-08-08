"use client";

import Image from "next/image";

const marketplaceItems = [
  {
    number: "01",
    title: "BEATS",
    description: "Buy, sell, and discover original production.",
  },
  {
    number: "02",
    title: "SERVICES",
    description: "Connect creators with producers and other talent.",
  },
  {
    number: "03",
    title: "ARTWORK",
    description: "Cover art, visuals, identity, and creative drops.",
  },
  {
    number: "04",
    title: "CREATOR DROPS",
    description: "Give your work a place to move through the Yard.",
  },
];

export default function MarketplaceScreen() {
  return (
    <section
      className="
        relative
        min-h-[680px]
        overflow-hidden
        rounded-[28px]
        border
        border-blue-300/10
        bg-[#07090b]
        shadow-[0_30px_120px_rgba(0,0,0,0.65)]
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
            bg-[linear-gradient(125deg,rgba(255,255,255,0.055),transparent_30%,rgba(60,100,135,0.13)_55%,transparent_80%)]
          "
        />

        <div
          className="
            absolute
            -right-40
            -top-40
            h-[620px]
            w-[620px]
            rounded-full
            bg-blue-500/[0.09]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -bottom-48
            -left-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-orange-500/[0.04]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.82)_100%)]
          "
        />

        {/* Industrial grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(180,210,230,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(180,210,230,0.7)_1px,transparent_1px)]
            [background-size:55px_55px]
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
          border-blue-200/10
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
              text-zinc-700
            "
          >
            07
          </span>

          <span className="h-px w-8 bg-blue-300/30" />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.35em]
              text-blue-300/60
            "
          >
            Creator Economy
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-blue-300/10
            bg-blue-950/30
            px-3
            py-2
          "
        >
          <span className="text-xs">🔒</span>

          <span
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.25em]
              text-blue-300/50
            "
          >
            Locked
          </span>
        </div>
      </div>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <div
        className="
          relative
          z-10
          grid
          min-h-[620px]
          lg:grid-cols-[1fr_0.95fr]
        "
      >
        {/* ==========================================================
            LEFT — COPY
        ========================================================== */}

        <div
          className="
            relative
            z-20
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
              text-blue-300/50
            "
          >
            Where The Yard Moves
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
              [background:linear-gradient(180deg,#e9eef0,#aeb8bd_35%,#58646b_55%,#e3e8ea_75%,#626d73)]
              bg-clip-text
              sm:text-7xl
              md:text-8xl
            "
          >
            MARKET
            <br />
            PLACE.
          </h2>

          <div
            className="
              mt-8
              h-px
              w-36
              bg-gradient-to-r
              from-blue-300/50
              via-blue-300/20
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
            A future home for the things creators make, sell, discover, and
            trade inside RapYard.
          </p>

          {/* ========================================================
              MARKETPLACE CATEGORIES
          ======================================================== */}

          <div className="mt-10 max-w-xl space-y-2">
            {marketplaceItems.map((item) => (
              <div
                key={item.number}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-blue-300/10
                  bg-blue-950/20
                  px-4
                  py-3
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-blue-200/10
                    text-[9px]
                    font-black
                    tracking-widest
                    text-blue-200/40
                  "
                >
                  {item.number}
                </span>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-blue-100/55
                    "
                  >
                    {item.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              LOCK STATUS
          ======================================================== */}

          <div
            className="
              mt-9
              flex
              w-fit
              items-center
              gap-4
              rounded-full
              border
              border-blue-300/15
              bg-blue-950/30
              px-6
              py-4
            "
          >
            <span className="text-sm">🔒</span>

            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.3em]
                text-blue-200/50
              "
            >
              Coming Soon
            </span>
          </div>
        </div>

        {/* ==========================================================
            ARTWORK / MARKETPLACE VISUAL
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
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="
              object-cover
              object-center
              grayscale-[0.45]
              opacity-55
            "
          />

          {/* Dark cinematic treatment */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#07090b]
              via-[#07090b]/45
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#07090b]
              via-transparent
              to-black/30
            "
          />

          {/* Blue Steel */}
          <div
            className="
              absolute
              inset-0
              bg-blue-950/30
              mix-blend-color
            "
          />

          <div className="absolute inset-0 bg-black/30" />

          {/* ========================================================
              MARKETPLACE FLOATING PANEL
          ======================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-10
              w-[min(420px,82%)]
              -translate-x-1/2
              -translate-y-1/2
              rounded-2xl
              border
              border-blue-200/15
              bg-black/70
              p-6
              shadow-[0_30px_90px_rgba(0,0,0,0.7)]
              backdrop-blur-xl
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.3em]
                    text-blue-200/40
                  "
                >
                  RAPYARD MARKET
                </p>

                <p
                  className="
                    mt-2
                    text-xl
                    font-black
                    uppercase
                    tracking-tight
                    text-zinc-200
                  "
                >
                  CREATOR GOODS
                </p>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-blue-200/10
                  bg-blue-950/40
                  text-lg
                "
              >
                🔒
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {["BEATS", "SERVICES", "ARTWORK", "DROPS"].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-lg
                    border
                    border-blue-200/10
                    bg-white/[0.025]
                    px-4
                    py-4
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-blue-200/40
                    "
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                rounded-lg
                border
                border-blue-300/20
                bg-blue-500/[0.04]
                px-5
                py-4
              "
            >
              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.35em]
                  text-blue-200/50
                "
              >
                🔒 COMING SOON
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
              border-blue-200/10
              bg-black/60
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
                text-zinc-700
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
                text-blue-200/50
              "
            >
              Built For Creators
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
          via-blue-300/30
          to-transparent
        "
      />
    </section>
  );
}