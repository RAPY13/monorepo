import Link from "next/link";

import AuthGuard from "@/app/components/AuthGuard";
import BottomNav from "@/app/components/BottomNav";
import FoundersBadge from "@/components/ui/FoundersBadge";

const feedHighlights = [
  {
    label: "LIVE BATTLE",
    title: "The first throwdown hits the Yard.",
    description:
      "Rapper vs producer — listeners decide who levels up with the opening vote.",
    href: "/battles",
    accent: "orange",
  },
  {
    label: "FEATURED DROP",
    title: "New beat kit from Founder crew.",
    description:
      "Fresh samples, unreleased loops, and first-look drops for the Week 1 roster.",
    href: "/beats",
    accent: "blue",
  },
  {
    label: "LISTENER PULSE",
    title: "Vote, react, and shape the Yard.",
    description:
      "Your social vote powers the leaderboard and helps decide what gets attention next.",
    href: "/battles",
    accent: "purple",
  },
];

const activityItems = [
  {
    type: "BATTLE",
    title: "Forge vs Frequency",
    description: "Opening round is getting ready.",
    meta: "LIVE SOON",
  },
  {
    type: "DROP",
    title: "Founder Beat Pack",
    description: "A new collection just landed in the Yard.",
    meta: "NEW",
  },
  {
    type: "YARD",
    title: "Week 1 roster is forming.",
    description: "More creators are stepping through the gate.",
    meta: "ACTIVE",
  },
];

export default function FeedPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050607] pb-28 text-white">
        {/* ============================================================
            BACKGROUND
        ============================================================ */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="
              absolute
              left-1/2
              top-[-300px]
              h-[700px]
              w-[1000px]
              -translate-x-1/2
              rounded-full
              bg-blue-500/[0.045]
              blur-[150px]
            "
          />

          <div
            className="
              absolute
              bottom-[-250px]
              left-[-150px]
              h-[600px]
              w-[600px]
              rounded-full
              bg-orange-500/[0.035]
              blur-[150px]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.72)_100%)]
            "
          />
        </div>

        {/* ============================================================
            PAGE
        ============================================================ */}

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 lg:py-12">
          {/* ==========================================================
              HEADER
          ========================================================== */}

          <header
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-white/[0.025]
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.45)]
              md:p-9
            "
          >
            {/* chrome surface */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[linear-gradient(125deg,rgba(255,255,255,0.07),transparent_35%,rgba(65,105,135,0.08),transparent_75%)]
              "
            />

            <div className="relative z-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.4em]
                        text-orange-400
                      "
                    >
                      Week 1 Yard
                    </span>

                    <span className="h-px w-10 bg-orange-500/50" />
                  </div>

                  <h1
                    className="
                      mt-4
                      text-5xl
                      font-black
                      uppercase
                      leading-[0.82]
                      tracking-[-0.04em]
                      text-transparent
                      [background:linear-gradient(180deg,#fff,#d6dbde_35%,#737b80_55%,#fff_75%,#727a7f)]
                      bg-clip-text
                      sm:text-6xl
                      md:text-7xl
                    "
                  >
                    THE YARD.
                  </h1>

                  <p
                    className="
                      mt-5
                      max-w-2xl
                      text-sm
                      leading-7
                      text-zinc-500
                      md:text-base
                    "
                  >
                    The first real screen of RapYard. Battles, drops,
                    listener voice, and founder momentum — all moving in one
                    place.
                  </p>
                </div>

                {/* Founder identity */}
                <div className="shrink-0">
                  <FoundersBadge />
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/booth"
                  className="
                    rounded-full
                    border
                    border-orange-400/40
                    bg-orange-500/10
                    px-5
                    py-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-orange-300
                    transition
                    hover:border-orange-400
                    hover:bg-orange-500/20
                  "
                >
                  Enter Booth →
                </Link>

                <Link
                  href="/battles"
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-5
                    py-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-zinc-400
                    transition
                    hover:border-blue-300/30
                    hover:text-white
                  "
                >
                  Battles
                </Link>

                <Link
                  href="/beats"
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-5
                    py-3
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-zinc-400
                    transition
                    hover:border-blue-300/30
                    hover:text-white
                  "
                >
                  Beat Yard
                </Link>
              </div>
            </div>
          </header>

          {/* ==========================================================
              HIGHLIGHTS
          ========================================================== */}

          <section className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.35em]
                    text-zinc-600
                  "
                >
                  Yard Activity
                </p>

                <h2 className="mt-2 text-xl font-black uppercase text-zinc-200">
                  What&apos;s Moving
                </h2>
              </div>

              <span
                className="
                  hidden
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.3em]
                  text-zinc-700
                  sm:block
                "
              >
                WEEK 1
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {feedHighlights.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-white/20
                  "
                >
                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -right-16
                      -top-16
                      h-40
                      w-40
                      rounded-full
                      blur-3xl
                      ${
                        item.accent === "orange"
                          ? "bg-orange-500/10"
                          : item.accent === "blue"
                            ? "bg-blue-500/10"
                            : "bg-purple-500/10"
                      }
                    `}
                  />

                  <div className="relative z-10">
                    <p
                      className={`
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.35em]
                        ${
                          item.accent === "orange"
                            ? "text-orange-400"
                            : item.accent === "blue"
                              ? "text-blue-300"
                              : "text-purple-300"
                        }
                      `}
                    >
                      {item.label}
                    </p>

                    <h2
                      className="
                        mt-4
                        text-xl
                        font-black
                        uppercase
                        leading-tight
                        text-white
                      "
                    >
                      {item.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-500">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <span
                        className="
                          text-[9px]
                          font-black
                          uppercase
                          tracking-[0.3em]
                          text-zinc-600
                          transition
                          group-hover:text-orange-400
                        "
                      >
                        Open
                      </span>

                      <span
                        className="
                          text-zinc-700
                          transition
                          group-hover:translate-x-1
                          group-hover:text-orange-400
                        "
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ==========================================================
              MAIN FEED
          ========================================================== */}

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            {/* Feed */}
            <div
              className="
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-black/40
              "
            >
              <div className="border-b border-white/10 px-6 py-6 md:px-8">
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.35em]
                    text-red-300/70
                  "
                >
                  Feed Preview
                </p>

                <h2
                  className="
                    mt-3
                    text-2xl
                    font-black
                    uppercase
                    text-white
                    md:text-3xl
                  "
                >
                  Rundown For Launch Week.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                  Your home base for curated creator drops, live battles, and
                  the first listener-powered leaderboard.
                </p>
              </div>

              <div className="divide-y divide-white/10">
                {activityItems.map((item) => (
                  <div
                    key={item.title}
                    className="
                      group
                      px-6
                      py-6
                      transition
                      hover:bg-white/[0.025]
                      md:px-8
                    "
                  >
                    <div className="flex items-start gap-4">
                      {/* Activity marker */}
                      <div
                        className="
                          mt-1
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.03]
                          text-[9px]
                          font-black
                          text-orange-400
                        "
                      >
                        {item.type.slice(0, 2)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className="
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.3em]
                              text-zinc-600
                            "
                          >
                            {item.type}
                          </span>

                          <span
                            className="
                              text-[8px]
                              font-black
                              uppercase
                              tracking-[0.25em]
                              text-orange-400/70
                            "
                          >
                            {item.meta}
                          </span>
                        </div>

                        <h3
                          className="
                            mt-2
                            text-lg
                            font-black
                            uppercase
                            text-zinc-200
                          "
                        >
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-600">
                          {item.description}
                        </p>
                      </div>

                      <span
                        className="
                          hidden
                          text-zinc-700
                          transition
                          group-hover:text-orange-400
                          sm:block
                        "
                      >
                        →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current featured activity */}
              <div className="border-t border-white/10 p-6 md:p-8">
                <div
                  className="
                    rounded-3xl
                    border
                    border-orange-400/15
                    bg-orange-500/[0.035]
                    p-6
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-orange-400
                        shadow-[0_0_12px_rgba(251,146,60,0.7)]
                      "
                    />

                    <p
                      className="
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.3em]
                        text-orange-400
                      "
                    >
                      Live Now
                    </p>
                  </div>

                  <h3
                    className="
                      mt-4
                      text-xl
                      font-black
                      uppercase
                      text-white
                    "
                  >
                    Forge vs Frequency
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Opening battle activity is getting ready. The Yard will
                    decide what happens next.
                  </p>

                  <Link
                    href="/battles"
                    className="
                      mt-5
                      inline-flex
                      items-center
                      gap-3
                      rounded-full
                      border
                      border-orange-400/30
                      px-5
                      py-3
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.28em]
                      text-orange-300
                      transition
                      hover:border-orange-400
                      hover:bg-orange-500/10
                    "
                  >
                    View Battles →
                  </Link>
                </div>
              </div>
            </div>

            {/* ========================================================
                SIDEBAR
            ======================================================== */}

            <aside className="space-y-6">
              {/* Listener Mission */}
              <div
                className="
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-7
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.35em]
                    text-red-300/70
                  "
                >
                  Listener Mission
                </p>

                <h3 className="mt-3 text-xl font-black uppercase text-white">
                  Your Voice Matters.
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  Vote, react, and help determine which creators get the
                  attention and runway next.
                </p>

                <Link
                  href="/battles"
                  className="
                    mt-6
                    block
                    rounded-xl
                    border
                    border-white/10
                    bg-black/40
                    px-5
                    py-4
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.28em]
                    text-zinc-400
                    transition
                    hover:border-orange-400/30
                    hover:text-orange-300
                  "
                >
                  Enter The Arena →
                </Link>
              </div>

              {/* Founder */}
              <div
                className="
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-white/[0.025]
                  p-7
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.35em]
                    text-red-300/70
                  "
                >
                  Founder Identity
                </p>

                <h3 className="mt-3 text-xl font-black uppercase text-white">
                  Your Badge Stays.
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  Founders carry a permanent identity inside the Yard and
                  receive early access as the system expands.
                </p>

                <div className="mt-6">
                  <FoundersBadge />
                </div>
              </div>

              {/* Navigation */}
              <div
                className="
                  rounded-[2rem]
                  border
                  border-white/10
                  bg-black/40
                  p-7
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.35em]
                    text-zinc-600
                  "
                >
                  Explore
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    ["Yard", "/feed"],
                    ["Booth", "/booth"],
                    ["Battles", "/battles"],
                    ["Beats", "/beats"],
                    ["Profile", "/profile"],
                  ].map(([label, href]) => (
                    <Link
                      key={label}
                      href={href}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-white/5
                        bg-white/[0.02]
                        px-4
                        py-3
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.25em]
                        text-zinc-500
                        transition
                        hover:border-white/15
                        hover:text-white
                      "
                    >
                      <span>{label}</span>
                      <span>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>

        <BottomNav />
      </main>
    </AuthGuard>
  );
}