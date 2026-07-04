import Link from "next/link";

const nav = [
  { href: "/feed", label: "Yard", icon: "🏠" },
  { href: "/booth", label: "Booth", icon: "🎙" },
  { href: "/battles", label: "Battles", icon: "🥊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(95vw,46rem)] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/80 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="inline-flex flex-col items-center justify-center rounded-3xl py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            <span>{item.icon}</span>
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
