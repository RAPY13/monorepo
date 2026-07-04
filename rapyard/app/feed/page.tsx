import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";
import BottomNav from "@/app/components/BottomNav";
import FoundersBadge from "@/components/ui/FoundersBadge";

const feedHighlights = [
  {
    label: "Live Battle",
    title: "The first throwdown hits the Yard.",
    description: "Rapper vs producer — listeners decide who levels up with the opening vote.",
  },
  {
    label: "Featured Drop",
    title: "New beat kit from Founder crew.",
    description: "Fresh samples, unreleased loops, and first-look drops for the Week 1 roster.",
  },
  {
    label: "Listener Pulse",
    title: "Vote, react, and shape the Yard.",
    description: "Your social vote powers the leaderboard and unlocks future runway access.",
  },
];

export default function FeedPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-zinc-950 text-white pb-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 sm:px-8">
        <section className="rounded-[2.5rem] border border-white/10 bg-black/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Week 1 Yard</p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">The first real screen of RapYard.</h1>
              <p className="max-w-3xl text-base text-zinc-300 sm:text-lg">
                This is the Week 1 Yard: battles, drops, listener voice, and founder momentum all in one feed.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <FoundersBadge />
              <Link
                href="/?email=rapyard.app%40gmail.com"
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
              >
                Re-open Gate
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {feedHighlights.map((item) => (
            <article key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-yellow-300/40">
              <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/90">{item.label}</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/50 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-red-300">Feed preview</p>
            <h2 className="mt-4 text-3xl font-black text-white">Rundown for the launch week.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              This feed is your home base for Week 1: curated creator drops, live battles, and the first listener-powered leaderboard.
            </p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Live now</p>
                <p className="mt-2 font-semibold text-white">Forge vs Frequency — vote opens at 4:00 PM</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Drop</p>
                <p className="mt-2 font-semibold text-white">Founder beat pack unlocked for early members.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Listener mission</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Your vote and social signal determine which battle acts get runway support next.
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-300">Founder badge</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Founders get a permanent identity in the Yard and early access to the private feed.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/90">Next step</p>
              <p className="mt-2 text-sm leading-7 text-zinc-300">Tap the nav below to move between the Yard, Booth, Battles, and Profile.</p>
            </div>
          </aside>
        </section>
      </div>
      <BottomNav />
    </main>
    </AuthGuard>
  );
}
