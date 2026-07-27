"use client";

export default function HeroEffects() {
  return (
    <div
      data-hero="effects"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ======================================================
          MAIN CHROME AMBIENT LIGHT
      ====================================================== */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute left-1/2 top-[36%] h-[950px] w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(245,247,250,.11) 0%, rgba(185,195,210,.05) 38%, transparent 75%)",
          }}
        />
      </div>

      {/* ======================================================
          MATTE BLUE REFLECTION
      ====================================================== */}
      <div className="absolute inset-0 z-20">
        <div
          className="absolute right-[18%] top-[24%] h-[520px] w-[520px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(91,127,255,.08) 0%, rgba(91,127,255,.03) 45%, transparent 75%)",
          }}
        />
      </div>

      {/* ======================================================
          SUBTLE CHROME REFLECTION
      ====================================================== */}
      <div className="absolute inset-0 z-25">
        <div
          className="absolute left-[18%] bottom-[18%] h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 75%)",
          }}
        />
      </div>

      {/* ======================================================
          GLASS ATMOSPHERE
      ====================================================== */}
      <div
        className="absolute inset-0 z-30"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(255,255,255,.025),
              transparent 30%,
              rgba(255,255,255,.012) 100%
            )
          `,
        }}
      />

      {/* ======================================================
          FILM GRAIN
      ====================================================== */}
      <div
        className="absolute inset-0 z-35 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
      />

      {/* ======================================================
          BOTTOM ATMOSPHERIC FOG
      ====================================================== */}
      <div className="absolute inset-x-0 bottom-0 z-40 h-80">
        <div className="h-full bg-gradient-to-t from-black via-black/75 to-transparent" />
      </div>
    </div>
  );
}