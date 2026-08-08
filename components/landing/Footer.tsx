import Image from "next/image";
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
    <footer className="relative overflow-hidden bg-black text-white">
      {/* ============================================================ */}
      {/* Background */}
      {/* ============================================================ */}

      <div
        aria-hidden="true"
        className="
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-orange-500/8
          blur-[220px]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-zinc-950
          via-black
          to-black
        "
      />

      {/* ============================================================ */}
      {/* Content */}
      {/* ============================================================ */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        {/* ======================================================== */}
        {/* BLEED THA BLOCK — FINAL BRAND STAMP */}
        {/* ======================================================== */}

        <div className="relative mx-auto mb-24 flex max-w-5xl flex-col items-center text-center">
          {/* Orange glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-64
              w-[80%]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-orange-500/10
              blur-[100px]
            "
          />

          <p className="relative z-10 mb-6 text-xs font-bold uppercase tracking-[0.5em] text-orange-500">
            RAPYARD PRESENTS
          </p>

          <div className="relative z-10 w-full max-w-3xl">
            <Image
              src="/bleed-tha-block.png"
              alt="Bleed Tha Block Label"
              width={650}
              height={500}
              className="
                mx-auto
                h-auto
                w-[260px]
                select-none
                drop-shadow-[0_0_55px_rgba(255,80,0,.35)]
                transition-transform
                duration-700
                hover:scale-[1.04]
                md:w-[400px]
                lg:w-[500px]
              "
            />
          </div>

          <p className="relative z-10 mt-4 max-w-xl text-sm uppercase tracking-[0.3em] text-zinc-500">
            Built for the culture.
          </p>

          <div className="mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
        </div>

        {/* ======================================================== */}
        {/* Brand Statement */}
        {/* ======================================================== */}

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
            Respect Isn&apos;t Earned.
          </p>

          <h3 className="chrome-text mt-3 text-3xl font-black uppercase tracking-[0.2em] md:text-4xl">
            It&apos;s Recorded.
          </h3>
        </div>

        {/* ======================================================== */}
        {/* Navigation */}
        {/* ======================================================== */}

        <div className="mt-20 grid gap-12 border-t border-zinc-800 pt-16 md:grid-cols-2">
          {/* Explore */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Explore
            </h3>

            <ul className="mt-6 space-y-4">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="
                      text-zinc-400
                      transition-colors
                      duration-300
                      hover:text-orange-300
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">
              Legal
            </h3>

            <ul className="mt-6 space-y-4">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="
                      text-zinc-400
                      transition-colors
                      duration-300
                      hover:text-orange-300
                    "
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Bottom */}
        {/* ======================================================== */}

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