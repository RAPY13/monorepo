"use client";

import { ChevronDown } from "lucide-react";

export default function HeroScroll() {
  const scrollToNext = () => {
    const nextSection = document.getElementById("forge");

    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      data-hero="scroll"
      className="flex justify-center pb-4"
    >
      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to the next section"
        className="
          group
          flex
          flex-col
          items-center
          gap-3
          text-slate-400
          transition-colors
          duration-300
          hover:text-[#5B7FFF]
        "
      >
        <span
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.45em]
            text-slate-400
            transition-colors
            duration-300
            group-hover:text-slate-200
          "
        >
          SCROLL
        </span>

        {/* Mouse */}
        <div
          className="
            relative
            flex
            h-14
            w-8
            justify-center
            rounded-full
            border
            border-white/15
            bg-white/[0.02]
            backdrop-blur-sm
            transition-all
            duration-300
            group-hover:border-[#5B7FFF]/60
            group-hover:bg-[#5B7FFF]/5
            group-hover:shadow-[0_0_24px_rgba(91,127,255,.18)]
          "
        >
          <span
            className="
              absolute
              top-2
              h-2
              w-2
              rounded-full
              bg-slate-200
              animate-bounce
              group-hover:bg-[#5B7FFF]
            "
          />
        </div>

        {/* Arrow */}
        <ChevronDown
          size={22}
          className="
            text-slate-300
            transition-all
            duration-300
            group-hover:translate-y-1
            group-hover:text-[#5B7FFF]
            animate-bounce
          "
        />
      </button>
    </div>
  );
}