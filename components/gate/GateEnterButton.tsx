"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type GateEnterButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function GateEnterButton({
  onClick,
  disabled = false,
}: GateEnterButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    const enter = () => {
      if (disabled) return;

      gsap.to(button, {
        scale: 1.06,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const leave = () => {
      if (disabled) return;

      gsap.to(button, {
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const press = () => {
      if (disabled) return;

      gsap.to(button, {
        scale: 0.94,
        duration: 0.12,
        ease: "power2.out",
      });
    };

    const release = () => {
      if (disabled) return;

      gsap.to(button, {
        scale: 1.06,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    button.addEventListener("mouseenter", enter);
    button.addEventListener("mouseleave", leave);
    button.addEventListener("mousedown", press);
    button.addEventListener("mouseup", release);

    return () => {
      button.removeEventListener("mouseenter", enter);
      button.removeEventListener("mouseleave", leave);
      button.removeEventListener("mousedown", press);
      button.removeEventListener("mouseup", release);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      type="button"
      data-gate="button"
      disabled={disabled}
      onClick={onClick}
      className="
        group
        relative
        overflow-hidden
        rounded-full
        border
        border-orange-400
        bg-black/65
        px-10
        py-4
        text-sm
        font-black
        uppercase
        tracking-[0.3em]
        text-orange-300
        shadow-[0_0_25px_rgba(249,115,22,0.20)]
        backdrop-blur-md
        transition-colors
        duration-300

        hover:border-orange-300
        hover:bg-orange-500
        hover:text-black
        hover:shadow-[0_0_55px_rgba(249,115,22,0.65)]

        focus:outline-none
        focus:ring-2
        focus:ring-orange-400/70
        focus:ring-offset-2
        focus:ring-offset-black

        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {/* Metallic hover sweep */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-1/2
          w-1/3
          -skew-x-12
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
          opacity-0
          transition-all
          duration-700
          group-hover:left-[120%]
          group-hover:opacity-100
        "
      />

      {/* Button text */}
      <span className="relative z-10">
        Enter The Yard
      </span>

      {/* Arrow */}
      <span
        aria-hidden="true"
        className="
          relative
          z-10
          ml-3
          inline-block
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      >
        →
      </span>
    </button>
  );
}