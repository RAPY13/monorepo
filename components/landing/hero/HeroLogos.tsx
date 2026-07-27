"use client";

import Image from "next/image";

export default function HeroLogos() {
  return (
    <div
      data-hero="logos"
      className="flex flex-col items-center justify-center"
    >
      {/* ======================================================
          RAPYARD LOGO
      ====================================================== */}
      <div className="relative overflow-visible hero-logo">
        <Image
          src="/logo.png"
          alt="RapYard"
          width={900}
          height={900}
          priority
          draggable={false}
          className="
            h-auto
            w-64
            select-none
            drop-shadow-[0_0_24px_rgba(255,255,255,.16)]
            sm:w-80
            md:w-[28rem]
            lg:w-[36rem]
            xl:w-[44rem]
            2xl:w-[52rem]
          "
        />

        {/* Chrome Sweep */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            -translate-x-full
            bg-gradient-to-r
            from-transparent
            via-slate-100/40
            to-transparent
            opacity-60
            hero-logo-sweep
          "
        />
      </div>

      {/* ======================================================
          BLEED THA BLOCK
      ====================================================== */}
      <div className="relative mt-10 overflow-visible">
        <Image
          src="/bleed-tha-block.png"
          alt="Bleed Tha Block"
          width={1600}
          height={260}
          priority
          draggable={false}
          className="
            h-auto
            w-72
            select-none
            opacity-95
            drop-shadow-[0_0_12px_rgba(255,255,255,.08)]
            sm:w-[24rem]
            md:w-[31rem]
            lg:w-[40rem]
            xl:w-[46rem]
          "
        />

        {/* Chrome Sweep */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            -translate-x-full
            bg-gradient-to-r
            from-transparent
            via-slate-100/30
            to-transparent
            opacity-40
            hero-wordmark-sweep
          "
        />
      </div>

      {/* ======================================================
          DIVIDER
      ====================================================== */}
      <div className="mt-12 flex items-center gap-6">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-500/40 to-slate-300" />

        <span
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.55em]
            text-slate-300
            md:text-sm
          "
        >
          BUILT FOR THE{" "}
          <span className="font-bold text-[#5B7FFF]">
            CULTURE
          </span>
        </span>

        <div className="h-px w-24 bg-gradient-to-l from-transparent via-slate-500/40 to-slate-300" />
      </div>
    </div>
  );
}