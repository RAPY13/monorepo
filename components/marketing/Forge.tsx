export default function Forge() {
  return (
    <section className="bg-zinc-950 px-6 py-32 text-center">
      <h2 className="text-5xl font-black text-white">
        THE FORGE IS BURNING.
      </h2>

      <p className="mx-auto mt-8 max-w-2xl text-xl text-zinc-400">
        Join the creators shaping the future of RapYard.
      </p>

      <div className="mx-auto mt-12 flex max-w-xl flex-col gap-4 md:flex-row">
        <input
          type="email"
          placeholder="Email Address"
          className="flex-1 rounded-xl border border-zinc-700 bg-black px-5 py-4 text-white"
        />

        <button className="rounded-xl bg-orange-500 px-8 py-4 font-bold text-black hover:bg-orange-400">
          CLAIM YOUR FOUNDER SPOT
        </button>
      </div>
    </section>
  );
}
