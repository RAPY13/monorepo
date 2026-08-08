"use client";

import Image from "next/image";

const tapeFeatures = [
  {
    number: "01",
    title: "REVISIT",
    description: "Keep every take close and return to the records that matter.",
  },
  {
    number: "02",
    title: "ORGANIZE",
    description: "Build your tape from the work you've created inside the Yard.",
  },
  {
    number: "03",
    title: "CONTROL",
    description: "Choose what stays private, what gets shared, and what gets released.",
  },
  {
    number: "04",
    title: "BUILD YOUR LEGACY",
    description: "Turn individual records into something that represents you.",
  },
];

export default function TapeRoomScreen() {
  return (
    <section
      className="
        relative
        min-h-[680px]
        overflow-hidden
        rounded-[28px]
        border
        border-purple-300/10
        bg-[#07070a]
        shadow-[0_30px_120px_rgba(0,0,0,0.7)]
      "
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(125deg,rgba(255,255,255,0.045),transparent_28%,rgba(75,45,120,0.16)_55%,transparent_80%)]
          "
        />

        <div
          className="
            absolute
            -right-40
            -top-40
            h-[650px]
            w-[650px]
            rounded-full
            bg-purple-600/[0.11]
            blur-[150px]
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
            bg-red-600/[0.045]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_12%,rgba(0,0,0,0.86)_100%)]
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(200,180,220,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(200,180,220,0.7)_1px,transparent_1px)]
            [background-size:55px_55px]
          "
        />
      </div>

      {/* Top bar */}
      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-between
          border-b
          border-purple-200/10
          px-6
          py-5
          md:px-9
        "
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-black tracking-[0.35em] text-zinc-700">
            06
          </span>

          <span className="h-px w-8 bg-purple-300/30" />

          <span
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.35em]
              text-purple-300/65
            "
          >
            Archive
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-purple-300/10
            bg-purple-950/30
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
              text-purple-300/50
            "
          >
            Locked
          </span>
        </div>
      </div>

      {/* Main */}
      <div
        className="
          relative
          z-10
          grid
          min-h-[620px]
          lg:grid-cols-[1fr_1.05fr]
        "
      >
        {/* Copy */}
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
              text-purple-300/50
            "
          >
            Your Creative Archive
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
              [background:linear-gradient(180deg,#f1eef4,#c6c0ca_35%,#655d6d_55%,#f1eef4_74%,#716979)]
              bg-clip-text
              sm:text-7xl
              md:text-8xl
            "
          >
            TAPE
            <br />
            ROOM.
          </h2>

          <div
            className="
              mt-8
              h-px
              w-36
              bg-gradient-to-r
              from-purple-400/60
              via-purple-300/20
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
            Your records become your archive. Keep the takes, organize the
            work, and build the tape that represents your run through RapYard.
          </p>

          {/* Features */}
          <div className="mt-10 max-w-xl space-y-2">
            {tapeFeatures.map((feature) => (
              <div
                key={feature.number}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-purple-300/10
                  bg-purple-950/20
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
                    border-purple-200/10
                    text-[9px]
                    font-black
                    tracking-widest
                    text-purple-200/40
                  "
                >
                  {feature.number}
                </span>

                <div>
                  <p
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.22em]
                      text-purple-100/60
                    "
                  >
                    {feature.title}
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-zinc-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lock status */}
          <div
            className="
              mt-9
              flex
              w-fit
              items-center
              gap-4
              rounded-full
              border
              border-purple-300/15
              bg-purple-950/30
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
                text-purple-200/50
              "
            >
              Coming Soon
            </span>
          </div>
        </div>

        {/* Visual side */}
        <div
          className="
            relative
            min-h-[430px]
            overflow-hidden
            lg:min-h-0
          "
        >
          {/* Approved Tape Room artwork */}
          <Image
            src="/images/yard/tape-room.webp"
            alt="RapYard Tape Room"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="
              object-cover
              object-center
              opacity-75
            "
          />

          {/* Cinematic fades */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#07070a]
              via-[#07070a]/25
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#07070a]
              via-transparent
              to-black/20
            "
          />

          {/* Purple atmosphere */}
          <div className="absolute inset-0 bg-purple-950/15 mix-blend-color" />

          {/* Lock treatment */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />

          {/* Tape Room quote */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              z-10
              w-[min(390px,78%)]
              -translate-x-1/2
              -translate-y-1/2
              text-center
            "
          >
            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.35em]
                text-purple-200/60
              "
            >
              RAPYARD
            </p>

            <p
              className="
                mt-4
                text-3xl
                font-black
                uppercase
                leading-[0.9]
                tracking-tight
                text-white/90
                drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]
                md:text-4xl
              "
            >
              RESPECT ISN'T EARNED.
              <br />
              <span className="text-purple-300/80">
                IT'S RECORDED.
              </span>
            </p>

            <div
              className="
                mx-auto
                mt-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-purple-200/20
                bg-black/60
                text-xl
                shadow-[0_0_70px_rgba(120,70,170,0.18)]
                backdrop-blur-md
              "
            >
              🔒
            </div>

            <p
              className="
                mt-4
                text-[9px]
                font-black
                uppercase
                tracking-[0.35em]
                text-purple-200/50
              "
            >
              Coming Soon
            </p>
          </div>

          {/* Bottom label */}
          <div
            className="
              absolute
              bottom-7
              right-7
              z-10
              rounded-lg
              border
              border-purple-200/10
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
                text-purple-200/50
              "
            >
              The Archive
            </p>
          </div>
        </div>
      </div>

      {/* Bottom metal line */}
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
          via-purple-300/30
          to-transparent
        "
      />
    </section>
  );
}