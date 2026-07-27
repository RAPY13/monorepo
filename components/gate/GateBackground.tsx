"use client";

import Image from "next/image";

export default function GateBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fence / Industrial Background */}
      <Image
        src="/gate-bg.webp"
        alt="RapYard Gate"
        fill
        priority
        className="object-cover opacity-45"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Orange Fire Glow */}
      <div
        className="
          absolute
          bottom-0
          inset-x-0
          h-96
          bg-gradient-to-t
          from-orange-600/30
          via-orange-500/10
          to-transparent
          blur-3xl
        "
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_35%,rgba(0,0,0,.85)_100%)]" />
    </div>
  );
}