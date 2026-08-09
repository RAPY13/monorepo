"use client";

type StudioSpeakerWallProps = {
  level: number;
  active: boolean;
};

const speakers: Array<{
  size: "small" | "medium" | "large";
  delay: number;
}> = [
  { size: "large", delay: 0 },
  { size: "medium", delay: 0.035 },
  { size: "large", delay: 0.07 },
  { size: "small", delay: 0.02 },
  { size: "medium", delay: 0.055 },
  { size: "large", delay: 0.09 },
];

export default function StudioSpeakerWall({
  level,
  active,
}: StudioSpeakerWallProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Left speaker stacks */}
      <div className="absolute left-[-18px] top-1/2 flex -translate-y-1/2 flex-col gap-5 opacity-95 sm:left-5">
        {speakers.slice(0, 3).map((speaker, index) => (
          <Speaker
            key={`left-${index}`}
            size={speaker.size}
            level={level}
            active={active}
            delay={speaker.delay}
          />
        ))}
      </div>

      {/* Right speaker stacks */}
      <div className="absolute right-[-18px] top-1/2 flex -translate-y-1/2 flex-col gap-5 opacity-95 sm:right-5">
        {speakers.slice(3).map((speaker, index) => (
          <Speaker
            key={`right-${index}`}
            size={speaker.size}
            level={level}
            active={active}
            delay={speaker.delay}
          />
        ))}
      </div>

      {/* Back wall speakers */}
      <div className="absolute left-1/2 top-10 hidden -translate-x-1/2 gap-6 opacity-80 lg:flex">
        <Speaker
          size="medium"
          level={level}
          active={active}
          delay={0.045}
        />

        <Speaker
          size="large"
          level={level}
          active={active}
          delay={0}
        />

        <Speaker
          size="medium"
          level={level}
          active={active}
          delay={0.065}
        />
      </div>
    </div>
  );
}

function Speaker({
  size,
  level,
  active,
  delay,
}: {
  size: "small" | "medium" | "large";
  level: number;
  active: boolean;
  delay: number;
}) {
  const dimensions = {
    small: "h-24 w-20",
    medium: "h-32 w-28",
    large: "h-40 w-36",
  };

  /*
   * The speaker cone responds to the real microphone level.
   *
   * level = 0      → completely still
   * level = 1      → maximum flex
   *
   * The multiplier is intentionally restrained so it feels
   * like a real speaker cone instead of a cartoon visualizer.
   */
  const flexAmount = active
    ? Math.min(0.13, level * 0.13)
    : 0;

  const glowAmount = active
    ? Math.min(0.22, level * 0.22)
    : 0.02;

  return (
    <div
      className={`relative ${dimensions[size]} rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black p-2 shadow-[0_20px_50px_rgba(0,0,0,.75)]`}
    >
      {/* Cabinet */}
      <div className="absolute inset-1 rounded-lg border border-white/[0.04]" />

      {/* Woofer */}
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-700 via-zinc-950 to-black shadow-[inset_0_0_18px_rgba(0,0,0,.9)] transition-transform duration-75"
        style={{
          transform: `translate(-50%, -50%) scale(${1 + flexAmount})`,
          boxShadow: `
            inset 0 0 18px rgba(0,0,0,.95),
            0 0 ${Math.round(glowAmount * 80)}px rgba(249,115,22,${glowAmount})
          `,
          transitionDelay: `${delay}s`,
        }}
      >
        {/* Cone */}
        <div className="absolute inset-[12%] rounded-full border border-zinc-700/70 bg-gradient-to-br from-zinc-600/40 via-zinc-950 to-black" />

        {/* Dust cap */}
        <div
          className="absolute left-1/2 top-1/2 h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-600 bg-zinc-900"
          style={{
            transform: `translate(-50%, -50%) scale(${
              1 + flexAmount * 0.45
            })`,
          }}
        />

        {/* Orange reflection */}
        <div
          className="absolute inset-[18%] rounded-full bg-orange-500/10 blur-xl transition-opacity duration-75"
          style={{
            opacity: active ? Math.min(0.8, level * 1.2) : 0.08,
          }}
        />
      </div>
    </div>
  );
}