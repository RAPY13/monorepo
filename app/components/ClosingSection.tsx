export default function ClosingSection() {
  return (
    <footer className="border-t border-zinc-800 bg-black/80 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h3 className="text-3xl font-black tracking-[0.24em] uppercase text-white md:text-4xl">
            RAPYARD™
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            Built for Bars, Not Algorithms.
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-lg text-zinc-500 md:text-xl">
            The workshop where rappers record, battle, build, and grow.
          </p>
        </div>

        <div className="my-12 border-t border-zinc-800" />

        <div className="space-y-3 text-center">
          <p className="text-2xl italic text-zinc-300 md:text-3xl">
            Some will discover RapYard.
          </p>

          <h4 className="text-4xl font-black uppercase tracking-wide text-yellow-400 md:text-5xl">
            Founders will be remembered.
          </h4>

          <p className="text-base uppercase tracking-[0.28em] text-zinc-600 md:text-lg">
            Claim your place before the gates close.
          </p>
        </div>

        <div className="my-12 border-t border-zinc-800" />

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-base uppercase tracking-[0.2em] text-zinc-500 md:text-lg">
          <a href="/privacy" className="transition hover:text-yellow-400">
            Privacy
          </a>

          <a href="/terms" className="transition hover:text-yellow-400">
            Terms
          </a>

          <a href="/community" className="transition hover:text-yellow-400">
            Community
          </a>

          <a href="mailto:rapyard.app@gmail.com" className="transition hover:text-yellow-400">
            Contact
          </a>
        </div>

        <div className="text-center text-base leading-8 text-zinc-500 md:text-lg">
          <p>
            © 2026 <span className="font-semibold text-zinc-300">RapYard™</span>. All
            Rights Reserved.
          </p>

          <p className="mx-auto mt-4 max-w-4xl">
            RapYard™, its branding, logos, original software, user interface,
            visual designs, artwork, and original creative assets are the
            intellectual property of Jesse Lopez Jr. Unauthorized copying,
            reproduction, distribution, reverse engineering, or commercial use
            of RapYard or its original assets without prior written permission
            is strictly prohibited.
          </p>

          <p className="mt-4 text-zinc-600">
            Users retain ownership of the music, lyrics, recordings, beats,
            artwork, and other original content they create and upload to RapYard.
          </p>
        </div>
      </div>
    </footer>
  );
}
