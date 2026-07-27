export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.35em] text-orange-400">
          RAPYARD
        </p>

        <h1 className="mt-4 text-5xl font-black">
          Welcome to the Yard.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Your dashboard will become the central place for your music,
          collaborations, battles, recordings, and profile.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Recording Booth",
            "The Yard",
            "Battles",
            "Profile",
          ].map((card) => (
            <div
              key={card}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-xl"
            >
              <h2 className="text-2xl font-bold">
                {card}
              </h2>

              <p className="mt-4 text-zinc-400">
                Coming soon.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}