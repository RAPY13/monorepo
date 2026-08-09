"use client";

import Image from "next/image";

export default function GateBackground() {
  return (
    <div
      data-gate="background"
      className="absolute inset-0 z-0 overflow-hidden bg-black"
    >
      {/* Yard — hidden behind the closed gate */}
      <Image
        src="/images/gate/yard-background.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Closed RapYard gate */}
      <div
        data-gate="closed-gate"
        className="absolute inset-0 z-10"
      >
        <Image
          src="/images/gate/gate.webp"
          alt="RapYard Gate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Cinematic dark grade */}
      <div className="absolute inset-0 z-20 bg-black/20" />

      {/* Vignette */}
      <div
        className="
          absolute inset-0 z-30
          bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,.8)_100%)]
        "
      />
    </div>
  );
}