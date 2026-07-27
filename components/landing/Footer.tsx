import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "The Forge", href: "#forge" },
  { label: "Districts", href: "#districts" },
  { label: "Creator Journey", href: "#journey" },
];

const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-zinc-800 bg-black text-white"
      aria-labelledby="footer-heading"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/8 blur-[220px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-black" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">

        {/* Brand Statement */}

        <div className="mx-auto max-w-4xl text-center">

          <h2
            id="footer-heading"
            className="chrome-text text-5xl font-black md:text-6xl"
          >
            RAPYARD
          </h2>

          <p className="mt-6 text-lg text-zinc-400">
            Create.
            <br />
            Collaborate.
            <br />
            Compete.
          </p>

          <div className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.45em] text-orange-300">
            Respect Isn't Earned.
          </p>

          <h3 className="chrome-text mt-3 text-3xl font-black uppercase tracking-[0.2em] md:text-4xl">
            It's Recorded.
          </h3>

        </div>

        {/* Navigation */}

        <div className="mt-20 grid gap-12 border-t border-zinc-800 pt-16 md:grid-cols-2">

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">

              {navigation.map((item) => (

                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="text-zinc-400 transition-colors duration-300 hover:text-orange-300"
                  >
                    {item.label}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Legal
            </h3>

            <ul className="mt-6 space-y-4">

              {legal.map((item) => (

                <li key={item.label}>

                  <Link
                    href={item.href}
                    className="text-zinc-400 transition-colors duration-300 hover:text-orange-300"
                  >
                    {item.label}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-20 border-t border-zinc-800 pt-10 text-center">

          <p className="text-sm uppercase tracking-[0.25em] text-orange-300">
            Founding Members • Building the Future of Music
          </p>

          <p className="mt-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} RapYard. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
}