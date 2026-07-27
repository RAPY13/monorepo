"use client";

export default function GateDoors() {
  return (
    <div
      data-gate="doors"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {/* Light behind the gate */}
      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.35),transparent_70%)]
        "
      />

      {/* Left Door */}
      <div
        data-gate="doors-left"
        className="
          absolute
          left-0
          top-0
          h-full
          w-1/2
          border-r
          border-white/10
          bg-zinc-950
          shadow-[inset_-10px_0_40px_rgba(0,0,0,.8)]
        "
      >
        {/* Metal texture */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,.15),transparent)]" />

        {/* Vertical reinforcement bars */}
        <div className="absolute inset-y-0 right-8 w-px bg-white/10" />
        <div className="absolute inset-y-0 right-20 w-px bg-white/5" />
      </div>

      {/* Right Door */}
      <div
        data-gate="doors-right"
        className="
          absolute
          right-0
          top-0
          h-full
          w-1/2
          border-l
          border-white/10
          bg-zinc-950
          shadow-[inset_10px_0_40px_rgba(0,0,0,.8)]
        "
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,.15),transparent)]" />

        <div className="absolute inset-y-0 left-8 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-20 w-px bg-white/5" />
      </div>

      {/* Center seam */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
    </div>
  );
}