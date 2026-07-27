"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

type GateEnterButtonProps = {
  onEnter: () => void;
};

export default function GateEnterButton({
  onEnter,
}: GateEnterButtonProps) {
  const [opening, setOpening] = useState(false);

  function handleClick() {
    if (opening) return;

    setOpening(true);
    onEnter();
  }

  return (
    <div data-gate="button" className="flex justify-center">
      <button
        onClick={handleClick}
        disabled={opening}
        className="
          group
          relative
          inline-flex
          items-center
          gap-3
          overflow-hidden
          rounded-xl
          border
          border-orange-500
          bg-orange-500
          px-10
          py-5
          font-bold
          uppercase
          tracking-[0.30em]
          text-black
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-orange-400
          hover:shadow-[0_0_45px_rgba(249,115,22,.45)]
          disabled:cursor-not-allowed
          disabled:opacity-80
        "
      >
        {/* Animated glow */}
        <span
          className="
            absolute
            inset-0
            animate-pulse
            bg-white/10
            opacity-20
          "
        />

        <span className="relative z-10">
          {opening ? "OPENING..." : "ENTER THE YARD"}
        </span>

        <ArrowRight
          className="
            relative
            z-10
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
          size={18}
        />
      </button>
    </div>
  );
}