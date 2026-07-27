"use client";

export default function GateAtmosphere() {
  return (
    <>
      {/* Smoke */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,.08),transparent_70%)]
          animate-pulse
          blur-3xl
        "
      />

      {/* Fire Glow */}
      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-80
          w-80
          -translate-x-1/2
          rounded-full
          bg-orange-500/20
          blur-[120px]
        "
      />

      {/* Spotlight */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-full
          w-40
          -translate-x-1/2
          bg-gradient-to-b
          from-white/10
          to-transparent
          blur-2xl
        "
      />
    </>
  );
}