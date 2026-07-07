import Smoke from "@/components/effects/Smoke";
import Image from "next/image";
import Link from "next/link";

import WaitlistForm from "@/components/marketing/WaitlistForm";

export default function Hero() {
  return (
    <section className="hero-shell relative isolate overflow-hidden px-6 pb-28 pt-[10rem] text-center md:pb-36 md:pt-[12.5rem]">
      <div className="hero-chain-link pointer-events-none absolute inset-0" />
      <div className="hero-city pointer-events-none absolute inset-x-0 bottom-0 h-[34vh]" />

      <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <Smoke />
      </div>

      <div className="gate-entrance relative mx-auto max-w-[68rem]">
        <h1 className="text-[clamp(4.5rem,8.8vw,6rem)] font-black uppercase leading-[0.95] tracking-[0.12em] text-zinc-100">
          THE GATE
        </h1>

        <div className="mx-auto mt-20 w-full max-w-[34rem] px-2 md:mb-24 md:mt-24">
          <Image
            src="/images/logo/logo.png"
            alt="RapYard logo"
            width={768}
            height={768}
            className="mx-auto h-auto w-full"
            priority
          />
        </div>

        <p className="mx-auto mt-10 max-w-[64rem] text-[clamp(1.45rem,2.6vw,1.62rem)] leading-[1.24] text-zinc-100">
          <strong>RapYard is the rap workshop in your pocket.</strong>
        </p>

        <p className="mx-auto mt-10 max-w-[64rem] text-[clamp(1.4rem,2.4vw,1.56rem)] leading-[1.25] text-zinc-200">
          A place built for rappers to:
        </p>

        <ul className="mx-auto mt-12 max-w-2xl space-y-4 text-left text-[clamp(1.35rem,2.2vw,1.5rem)] leading-[1.26] text-zinc-100">
          <li>🎙️ Record instantly</li>
          <li>⚔️ Jump into battles</li>
          <li>🎤 Join cyphers</li>
          <li>💿 Build tapes</li>
          <li>🎧 Discover beats</li>
        </ul>

        <p className="mx-auto mt-16 max-w-[64rem] text-[clamp(1.45rem,2.3vw,1.6rem)] leading-[1.25] text-zinc-100">
          <strong>Everything a rapper needs. Nothing they don&apos;t.</strong>
        </p>

        <div className="mx-auto mt-16 h-[4px] w-[min(92vw,42rem)] bg-[linear-gradient(to_right,transparent,#c0c0c0,transparent)]" aria-hidden />

        <h2 className="mx-auto mt-16 max-w-[64rem] text-[clamp(3rem,6.2vw,4rem)] font-black uppercase leading-[1.05] tracking-[0.08em] text-[#d4af37]">
          Built for Bars, Not Algorithms
        </h2>

        <p className="mx-auto mt-12 max-w-[64rem] text-[clamp(1.35rem,2.1vw,1.52rem)] leading-[1.25] text-zinc-200">
          The internet rewards attention.
        </p>

        <p className="mx-auto mt-10 max-w-[64rem] text-[clamp(1.7rem,2.8vw,2rem)] leading-[1.2] text-zinc-100">
          <strong>RapYard rewards dedication.</strong>
        </p>

        <div className="mx-auto mt-12 max-w-2xl space-y-4 text-[clamp(1.35rem,2.1vw,1.5rem)] leading-[1.24] text-zinc-300">
          <p>No filters.</p>
          <p>No clout games.</p>
          <p>No endless scrolling.</p>
        </div>

        <p className="mx-auto mt-12 max-w-[64rem] text-[clamp(1.35rem,2.1vw,1.5rem)] leading-[1.25] text-zinc-200">
          Just a place to sharpen your craft.
        </p>

        <div className="mx-auto mt-12 max-w-2xl space-y-4 text-[clamp(1.55rem,2.6vw,1.9rem)] font-semibold leading-[1.22] text-zinc-100">
          <p>Clock in.</p>
          <p>Put in the work.</p>
          <p>Leave better than you arrived.</p>
        </div>

        <div className="relative mx-auto mt-20 max-w-[66rem]">
          <div className="pointer-events-none absolute inset-0 m-auto h-72 w-72 rounded-full bg-[radial-gradient(circle,#c0c0c033_0%,transparent_72%)] blur-2xl" />
          <div className="relative grid gap-5 md:grid-cols-3">
            <Link
              href="/booth"
              className="border-[3px] border-zinc-200 bg-[#111111] px-11 py-6 text-[clamp(1.38rem,2.1vw,1.58rem)] font-bold uppercase leading-[1.2] text-white transition hover:border-[#c0c0c0] hover:text-[#c0c0c0]"
            >
              Start Recording
            </Link>
            <Link
              href="/battles"
              className="border-[3px] border-zinc-200 bg-[#111111] px-11 py-6 text-[clamp(1.38rem,2.1vw,1.58rem)] font-bold uppercase leading-[1.2] text-white transition hover:border-[#c0c0c0] hover:text-[#c0c0c0]"
            >
              Enter a Battle
            </Link>
            <Link
              href="/feed"
              className="border-[3px] border-zinc-200 bg-[#111111] px-11 py-6 text-[clamp(1.38rem,2.1vw,1.58rem)] font-bold uppercase leading-[1.2] text-white transition hover:border-[#c0c0c0] hover:text-[#c0c0c0]"
            >
              Browse Beats
            </Link>
          </div>
        </div>

        <div className="mt-24 md:mt-28">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
