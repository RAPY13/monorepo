import BottomNav from "@/components/layout/BottomNav";

export default function BoothPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-12 sm:px-8 pb-24">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-white/10 bg-black/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-red-300">Booth</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Studio Booth</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Protected launch destination for your creative workflow, tracks, and founder badge exposure.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
