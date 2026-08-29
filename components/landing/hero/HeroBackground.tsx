"use client";

export default function HeroBackground() {
  return (
    <div
      data-hero="background"
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-black" />

      {/* Hero Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url('/images/hero/RapBlock%20(2).png')",
        }}
      />

      {/* Cool Ambient Chrome Light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(255,255,255,.08), transparent 65%)",
        }}
      />

      {/* Diamond Steel Mesh */}
      <div className="absolute inset-0 bg-diamond opacity-[0.05]" />

      {/* Frost Layer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,.02), transparent 40%)",
        }}
      />

      {/* Main Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Top Fade */}
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/70 to-transparent" />

      {/* Bottom Fade */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/90 to-transparent" />

      {/* Left Fade */}
      <div className="absolute inset-y-0 left-0 w-56 bg-gradient-to-r from-black to-transparent" />

      {/* Right Fade */}
      <div className="absolute inset-y-0 right-0 w-56 bg-gradient-to-l from-black to-transparent" />

      {/* Cinematic Vignette */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 280px rgba(0,0,0,.94)",
        }}
      />
    </div>
  );
}