import BottomNav from "@/components/navigation/BottomNav";

export default function BattlesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 sm:px-8 pb-24">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-black/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Battles</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Battle Arena</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Locked down for authenticated users only. This is where creator showdowns, voting, and OG badges become real.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
