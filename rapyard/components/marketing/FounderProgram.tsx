import Image from "next/image";
import Link from "next/link";

import FounderCounter from "@/components/marketing/FounderCounter";

export default function FounderProgram() {
  return (
    <section className="relative border-y border-[#1a1a1a] bg-[radial-gradient(circle_at_center,#181818_0%,#0a0a0a_64%)] px-6 py-32 text-center md:py-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[5px] bg-[linear-gradient(to_right,transparent,#c0c0c0,transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[5px] bg-[linear-gradient(to_right,transparent,#c0c0c0,transparent)]" />

      <div className="mx-auto max-w-[68rem]">
        <div className="mx-auto w-fit overflow-hidden rounded-full border border-[#d4af37]/45 bg-black/80 p-4 shadow-[0_0_70px_rgba(212,175,55,0.24)]">
          <Image
            src="/images/founder-badge.png"
            alt="RapYard Founders Badge"
            width={260}
            height={260}
            priority
            className="aspect-square w-[250px] rounded-full object-cover md:w-[290px]"
          />
        </div>

        <h2 className="mt-16 text-[clamp(3rem,6vw,4rem)] font-black uppercase leading-[1.05] tracking-[0.08em] text-zinc-100">
          The Founders Program
        </h2>

        <p className="mx-auto mt-12 max-w-[62rem] text-[clamp(3rem,6vw,4rem)] font-black leading-[1.08] text-[#d4af37]">
          Only 500 Founder Badges will ever exist.
        </p>

        <FounderCounter />

        <div className="mx-auto mt-20 w-full max-w-[48rem]">
          <Link
            href="/?openModal=1"
            className="block border-[3px] border-[#d4af37] bg-[#111111] px-12 py-7 text-[clamp(1.55rem,2.8vw,1.9rem)] font-black uppercase leading-[1.18] tracking-[0.04em] text-[#d4af37] transition hover:border-[#c0c0c0] hover:text-[#c0c0c0]"
          >
            Claim Your Founder Badge
          </Link>
        </div>
      </div>
    </section>
  );
}
