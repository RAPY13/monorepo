export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] text-white">

      {/* Steel Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111111] to-black" />

      {/* Forge Glow */}
      <div className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[180px]" />

      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-10
        bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),
        linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)]
        bg-[size:70px_70px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">

        <div className="mb-6 inline-block rounded-full border border-orange-500/40 bg-black/40 px-5 py-2 uppercase tracking-[0.35em] text-orange-400">
          Founding Access
        </div>

        <h1 className="text-7xl font-black leading-none tracking-tight md:text-[10rem]">
          RAPYARD
        </h1>

        <h2 className="mt-8 text-3xl font-bold md:text-6xl">
          THE FORGE IS OPEN.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-zinc-300 md:text-2xl">
          Hip-Hop never had a real home.
          <br />
          Built for artists.
          <br />
          Built for producers.
          <br />
          Built for listeners.
        </p>

        <button className="mt-14 rounded-xl border-2 border-orange-500 bg-orange-500/10 px-12 py-5 text-lg font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_40px_rgba(255,140,0,.55)]">
          ENTER THE YARD
        </button>

        <p className="mt-20 animate-bounce text-zinc-500">
          ↓ Scroll
        </p>

      </div>
    </section>
  );
}