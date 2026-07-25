const lanes = [
  {
    title: "Artist",
    icon: "🎤",
    items: ["Record", "Release", "Battle", "Build Your Legacy"],
  },
  {
    title: "Producer",
    icon: "🎹",
    items: ["Upload Beats", "License", "Collaborate", "Earn"],
  },
  {
    title: "Listener",
    icon: "🎧",
    items: ["Discover", "Vote", "Support", "Share"],
  },
];

export default function LaneCards() {
  return (
    <section className="bg-black px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-5xl font-black text-white">
          CHOOSE YOUR LANE
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {lanes.map((lane) => (
            <div
              key={lane.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 transition hover:-translate-y-2 hover:border-orange-500"
            >
              <h3 className="text-3xl font-bold text-white">
                {lane.icon} {lane.title}
              </h3>

              <ul className="mt-8 space-y-3 text-lg text-zinc-400">
                {lane.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}