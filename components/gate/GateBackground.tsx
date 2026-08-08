"use client";

import Image from "next/image";

export default function GateBackground() {
  return (
    <div
      data-gate="background"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black
      "
    >
      <Image
        src="/images/gate/gate.webp"
        alt="RapYard Gate"
        fill
        priority
        sizes="100vw"
        className="
          object-contain
          object-center
          opacity-90
        "
      />

      {/* Cinematic dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Edge vignette */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,.75)_100%)]
        "
      />
    </div>
  );
}