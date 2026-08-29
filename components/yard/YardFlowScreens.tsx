"use client";

import OnboardingScreen from "@/components/yard/screens/OnboardingScreen";
import YardScreen from "@/components/yard/screens/YardScreen";
import RecordFlowScreen from "@/components/yard/screens/RecordFlowScreen";
import CypherScreen from "@/components/yard/screens/CypherScreen";
import BattleArenaScreen from "@/components/yard/screens/BattleArenaScreen";
import TapeRoomScreen from "@/components/yard/screens/TapeRoomScreen";
import MarketplaceScreen from "@/components/yard/screens/MarketplaceScreen";

type FlowMapItem = {
  number: string;
  label: string;
  locked: boolean;
};

const flowMap: FlowMapItem[] = [
  {
    number: "01",
    label: "ONBOARDING",
    locked: false,
  },
  {
    number: "02",
    label: "THE YARD",
    locked: false,
  },
  {
    number: "03",
    label: "STUDIO",
    locked: false,
  },
  {
    number: "04",
    label: "CYPHER",
    locked: true,
  },
  {
    number: "05",
    label: "BATTLE",
    locked: true,
  },
  {
    number: "06",
    label: "TAPE",
    locked: true,
  },
  {
    number: "07",
    label: "MARKET",
    locked: true,
  },
];

export default function YardFlowScreens() {
  return (
    <section
      id="yard-flow"
      className="
        relative
        overflow-hidden
        border-y
        border-white/10
        bg-black/35
      "
    >
      {/* ============================================================
          BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue Steel */}
        <div
          className="
            absolute
            left-1/2
            top-0
            h-[700px]
            w-[1100px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/[0.045]
            blur-[160px]
          "
        />

        {/* Forge Orange */}
        <div
          className="
            absolute
            bottom-[10%]
            left-[-200px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-orange-500/[0.035]
            blur-[150px]
          "
        />

        {/* Purple Tape Room atmosphere */}
        <div
          className="
            absolute
            bottom-[-200px]
            right-[-150px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-purple-600/[0.025]
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          py-20
          md:px-10
          md:py-28
        "
      >
        {/* ==========================================================
            SECTION HEADER
        ========================================================== */}

        <div className="mb-14 max-w-4xl">
          <div className="flex items-center gap-4">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.45em]
                text-orange-400
              "
            >
              Original RapYard Flow
            </p>

            <div
              className="
                h-px
                w-24
                bg-gradient-to-r
                from-orange-500/60
                to-transparent
              "
            />
          </div>

          <h2
            className="
              mt-5
              text-6xl
              font-black
              uppercase
              leading-[0.82]
              tracking-[-0.04em]
              text-transparent
              [background:linear-gradient(180deg,#fff,#d6dbde_35%,#707980_55%,#fff_75%,#737a7f)]
              bg-clip-text
              sm:text-7xl
              md:text-8xl
            "
          >
            THE
            <br />
            SYSTEM.
          </h2>

          <div
            className="
              mt-8
              h-px
              w-40
              bg-gradient-to-r
              from-orange-500
              via-orange-400/40
              to-transparent
            "
          />

          <p
            className="
              mt-7
              max-w-2xl
              text-sm
              leading-7
              text-zinc-500
              md:text-base
            "
          >
            The original RapYard journey, rebuilt as a sequence of
            experiences inside the Yard.
          </p>
        </div>

        {/* ==========================================================
            FLOW MAP
        ========================================================== */}

        <div className="mb-12 hidden items-center gap-2 overflow-x-auto pb-2 lg:flex">
          {flowMap.map(({ number, label, locked }, index) => (
            <div
              key={number}
              className="flex shrink-0 items-center gap-2"
            >
              <div
                className={`
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-2
                  ${
                    locked
                      ? "border-blue-300/10 bg-blue-950/20"
                      : "border-orange-400/20 bg-orange-500/[0.035]"
                  }
                `}
              >
                <span
                  className={`
                    text-[9px]
                    font-black
                    tracking-[0.2em]
                    ${
                      locked
                        ? "text-blue-300/40"
                        : "text-orange-400"
                    }
                  `}
                >
                  {number}
                </span>

                {locked && (
                  <span
                    className="text-[9px] opacity-50"
                    aria-hidden="true"
                  >
                    🔒
                  </span>
                )}

                <span
                  className={`
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    ${
                      locked
                        ? "text-blue-200/40"
                        : "text-zinc-400"
                    }
                  `}
                >
                  {label}
                </span>
              </div>

              {index < flowMap.length - 1 && (
                <span
                  className="text-[10px] text-zinc-800"
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ==========================================================
            VISUAL FLOW
        ========================================================== */}

        <div className="space-y-10">
          {/* ========================================================
              01 — ONBOARDING
          ======================================================== */}

          <OnboardingScreen />

          {/* ========================================================
              02 — THE YARD
          ======================================================== */}

          <YardScreen />

          {/* ========================================================
              03 — RECORD FLOW
          ======================================================== */}

          <RecordFlowScreen />

          {/* ========================================================
              04 — CYPHER MODE
          ======================================================== */}

          <CypherScreen />

          {/* ========================================================
              05 — BATTLE ARENA
          ======================================================== */}

          <BattleArenaScreen />

          {/* ========================================================
              06 — TAPE ROOM
          ======================================================== */}

          <TapeRoomScreen />

          {/* ========================================================
              07 — MARKETPLACE
          ======================================================== */}

          <MarketplaceScreen />
        </div>

        {/* ==========================================================
            END OF FLOW
        ========================================================== */}

        <div className="mt-20 flex flex-col items-center text-center">
          <div
            className="
              h-px
              w-32
              bg-gradient-to-r
              from-transparent
              via-orange-500/60
              to-transparent
            "
          />

          <p
            className="
              mt-8
              text-[10px]
              font-black
              uppercase
              tracking-[0.45em]
              text-zinc-700
            "
          >
            The Yard Is Being Built
          </p>

          <p
            className="
              mt-3
              text-sm
              font-black
              uppercase
              tracking-[0.25em]
              text-orange-400/80
            "
          >
            One screen at a time.
          </p>

          <p
            className="
              mt-4
              max-w-md
              text-xs
              leading-6
              text-zinc-700
            "
          >
            Some doors are open. Some are waiting. The system grows from
            the work.
          </p>
        </div>
      </div>
    </section>
  );
}