export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,140,0,0.18),transparent_60%)]" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <span className="rounded-full border border-orange-500/30 px-4 py-2 text-sm uppercase tracking-[0.25em] text-orange-400">
          Founding Access
        </span>

        <h1 className="mt-8 text-7xl font-black tracking-tight text-white md:text-9xl">
          RAPYARD
        </h1>

        <h2 className="mt-8 text-3xl font-bold text-white md:text-5xl">
          HIP-HOP NEVER HAD A REAL HOME.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-zinc-400">
          Creators build the yard.
          <br />
          Listeners move the yard.
        </p>

        <button className="mt-14 rounded-2xl bg-orange-500 px-10 py-5 text-lg font-bold text-black transition hover:scale-105 hover:bg-orange-400">
          ENTER THE YARD
        </button>

        <p className="mt-16 animate-bounce text-zinc-500">
          ↓ Scroll
        </p>
      </div>
    </section>
  );
}