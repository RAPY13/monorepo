"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock3, Flame, Glasses, MessageCircle, Repeat2, Rocket, Users, Wrench, Zap } from "lucide-react";
import { useState } from "react";
import { createYardActivity, toggleYardReaction } from "@/app/actions/yardSocial";
import YardCard from "@/components/yard/YardCard";
import YardFlowScreens from "@/components/yard/YardFlowScreens";
import type { OnboardingProfile } from "@/lib/onboarding-profile";

const openCards = [
  {
    title: "THE STUDIO",
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

const yardEvents = [
  { title: "Beat Drop Hour", detail: "New production lands daily at 7 PM", icon: Zap, tone: "text-orange-400" },
  { title: "Midnight Cypher", detail: "Late-night freestyle room opens at 12 AM", icon: Users, tone: "text-blue-300" },
  { title: "Producer Spotlight", detail: "Today's featured sound is live now", icon: Wrench, tone: "text-emerald-300" },
];

const yardFeed = [
  { id: "northside", creator: "Northside K", title: "Basement Notes 04", lane: "underground", image: "/images/yard/rapyard-performer.webp", reactions: 18 },
  { id: "marlow", creator: "Marlow Beats", title: "Dust on the Keys", lane: "old_school", image: "/images/yard/tape-room.webp", reactions: 31 },
  { id: "juno", creator: "Juno 16", title: "Sixteen in One Take", lane: "freestyle", image: "/images/yard/rapyard-battle.webp", reactions: 24 },
];

export default function YardHome({
  profile,
}: {
  profile: OnboardingProfile;
}) {
  const artistName = profile.rap_name || "Creator";
  const lane = profile.lane
    ? profile.lane.replace(/_/g, " ").toUpperCase()
    : "UNSET";
  const styles: string[] = [];
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [socialError, setSocialError] = useState("");

  async function reactTo(id: string, reaction: "fire" | "bolt" | "sunglasses") {
    setSocialError("");
    const previous = reactions[id] || "";
    setReactions((current) => ({ ...current, [id]: previous === reaction ? "" : reaction }));
    try {
      await toggleYardReaction({ contentId: id, reaction });
    } catch (error) {
      setReactions((current) => ({ ...current, [id]: previous }));
      setSocialError(error instanceof Error ? error.message : "Unable to save reaction.");
    }
  }

  async function addActivity(id: string, activityType: "comment" | "repost" | "boost") {
    setSocialError("");
    try {
      await createYardActivity({ contentId: id, activityType });
    } catch (error) {
      setSocialError(error instanceof Error ? error.message : "Unable to save activity.");
    }
  }

  const prioritizedFeed = [...yardFeed].sort((a, b) => {
    const aMatch = a.lane === profile.lane ? 1 : 0;
    const bMatch = b.lane === profile.lane ? 1 : 0;
    return bMatch - aMatch;
  });
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

      <section className="relative z-10 border-b border-white/10 bg-[#090b0d]/80">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:px-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-orange-400">
              Yard Identity
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tight text-white">
                {artistName}
              </h2>
              {profile.username ? (
                <span className="pb-1 text-sm text-zinc-500">@{profile.username.replace(/^@/, "")}</span>
              ) : null}
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-500">
              {lane}
            </p>
            {styles.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {styles.map((style) => (
                  <span key={style} className="border border-orange-500/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-orange-300">
                    {style}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2">
            <YardMetric label="Mic" value="NOT TESTED" />
            <YardMetric label="Level" value={String(profile.level ?? 0)} />
            <YardMetric label="Respect" value="—" />
            <YardMetric label="Yard Code" value={`${profile.lane || "YARD"}-${profile.username || "CREATOR"}`.toUpperCase()} />
          </div>
        </div>
      </section>

      <section className="relative z-10 border-b border-white/10 bg-[#07090b]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10">
          <div className="flex items-center gap-4">
            <p className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">Live In The Yard</p>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-500/40 to-transparent" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {yardEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.title} className="border border-white/10 bg-white/[0.025] p-5">
                  <Icon className={`h-5 w-5 ${event.tone}`} />
                  <h3 className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-zinc-200">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{event.detail}</p>
                  <div className="mt-5 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">
                    <Clock3 className="h-3.5 w-3.5" /> Scheduled event
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative z-10 min-h-[560px] overflow-hidden border-b border-white/10">
        <Image
          src="/images/yard/yard-atmos.jpg"
          alt="RapYard courtyard"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1200px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        <div
          className="
            relative mx-auto flex min-h-[560px] items-end
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

      <section className="relative z-10 border-y border-white/10 bg-[#080a0c]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-orange-400">For Your Lane</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">Yard Feed</h2>
              <p className="mt-2 text-sm text-zinc-600">Weighted for {lane.toLowerCase()} and your recent sound.</p>
            </div>
            <Link href="/feed" className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 hover:text-orange-300">Open full feed â†’</Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {prioritizedFeed.map((item) => (
              <article key={item.id} className="overflow-hidden border border-white/10 bg-black">
                <div className="relative aspect-[16/10]">
                  <Image src={item.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-400">{item.lane.replace("_", " ")}</p>
                  <h3 className="mt-2 text-lg font-black uppercase text-zinc-100">{item.title}</h3>
                  <p className="mt-1 text-sm text-zinc-600">by {item.creator}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4">
                    <span className="text-xs text-zinc-600">{item.reactions + (reactions[item.id] ? 1 : 0)} reactions</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => reactTo(item.id, "fire")} aria-label={`React fire to ${item.title}`} title="Fire reaction" className={`p-2 transition ${reactions[item.id] === "fire" ? "text-orange-400" : "text-zinc-600 hover:text-orange-400"}`}><Flame className="h-4 w-4" /></button>
                      <button type="button" onClick={() => reactTo(item.id, "bolt")} aria-label={`React bolt to ${item.title}`} title="Bolt reaction" className={`p-2 transition ${reactions[item.id] === "bolt" ? "text-yellow-300" : "text-zinc-600 hover:text-yellow-300"}`}><Zap className="h-4 w-4" /></button>
                      <button type="button" onClick={() => void addActivity(item.id, "comment")} aria-label={`Comment on ${item.title}`} title="Comment" className="p-2 text-zinc-600 transition hover:text-white"><MessageCircle className="h-4 w-4" /></button>
                      <button type="button" onClick={() => void addActivity(item.id, "repost")} aria-label={`Repost ${item.title}`} title="Repost" className="p-2 text-zinc-600 transition hover:text-white"><Repeat2 className="h-4 w-4" /></button>
                      <button type="button" onClick={() => void addActivity(item.id, "boost")} aria-label={`Boost ${item.title} to the Yard`} title="Boost to Yard" className="p-2 text-zinc-600 transition hover:text-orange-400"><Rocket className="h-4 w-4" /></button>
                      <button type="button" onClick={() => reactTo(item.id, "sunglasses")} aria-label={`React sunglasses to ${item.title}`} title="Sunglasses reaction" className={`hidden p-2 transition hover:text-blue-300 sm:block ${reactions[item.id] === "sunglasses" ? "text-blue-300" : "text-zinc-600"}`}><Glasses className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {socialError ? <p role="alert" className="mt-5 text-xs text-red-400">{socialError}</p> : null}
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

            <span aria-hidden="true">â†’</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function YardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.025] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">{label}</p>
      <p className="mt-2 truncate text-sm font-black uppercase text-zinc-200">{value}</p>
    </div>
  );
}
