const features = [
  {
    icon: "🎤",
    title: "Create",
    body: "Record. Upload. Own your work.",
  },
  {
    icon: "⚔",
    title: "Compete",
    body: "Battles. Cyphers. Beat Drops.",
  },
  {
    icon: "👑",
    title: "Build",
    body: "Help shape RapYard from day one.",
  },
];

export default function WhyRapYard() {
  return (
    <section className="bg-[#090909] px-6 py-24 text-center">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl font-black uppercase tracking-[0.1em] text-zinc-100 md:text-6xl">
          Why RapYard
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-zinc-700/70 bg-zinc-900/55 p-8 text-center shadow-[0_0_30px_rgba(0,0,0,0.2)]"
            >
              <p className="text-4xl">{feature.icon}</p>
              <h3 className="mt-4 text-3xl font-extrabold text-yellow-300">{feature.title}</h3>
              <p className="mt-4 text-lg text-zinc-300 md:text-xl">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
