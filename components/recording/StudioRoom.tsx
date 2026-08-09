"use client";

import StudioSpeakerWall from "./StudioSpeakerWall";

type StudioRoomProps = {
  level: number;
  active: boolean;
};

export default function StudioRoom({
  level,
  active,
}: StudioRoomProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Deep studio room */}
      <div className="absolute inset-0 bg-[#070706]" />

      {/* Acoustic wall panels */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-zinc-900/80 via-zinc-950/70 to-black" />

      <div
        className="absolute inset-x-0 top-0 h-[62%] opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 70px, rgba(255,255,255,.025) 71px, transparent 72px)",
        }}
      />

      {/* Warm ceiling light */}
      <div
        className={`absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-[120px] transition-opacity duration-700 ${
          active ? "opacity-80" : "opacity-40"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,.16), rgba(249,115,22,.025) 45%, transparent 70%)",
        }}
      />

      {/* Left amber practical */}
      <div
        className="absolute left-[7%] top-[18%] h-2 w-20 rounded-full bg-orange-500 blur-md"
        style={{
          opacity: active
            ? Math.min(0.85, 0.3 + level)
            : 0.28,
        }}
      />

      {/* Right amber practical */}
      <div
        className="absolute right-[7%] top-[18%] h-2 w-20 rounded-full bg-orange-500 blur-md"
        style={{
          opacity: active
            ? Math.min(0.85, 0.3 + level)
            : 0.28,
        }}
      />

      {/* Back wall equipment racks */}
      <div className="absolute left-1/2 top-[16%] flex -translate-x-1/2 gap-3 opacity-70">
        <Rack level={level} active={active} />
        <Rack level={level} active={active} />
        <Rack level={level} active={active} />
      </div>

      {/* Reactive speaker wall */}
      <StudioSpeakerWall
        level={level}
        active={active}
      />

      {/* Studio desk */}
      <div className="absolute bottom-[15%] left-1/2 w-[82%] -translate-x-1/2">
        {/* Rear edge */}
        <div className="h-4 rounded-t-xl border border-zinc-700 bg-gradient-to-b from-zinc-600 to-zinc-900 shadow-[0_15px_50px_rgba(0,0,0,.8)]" />

        {/* Desktop */}
        <div className="relative h-24 border-x border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
          <MixingConsole
            level={level}
            active={active}
          />

          {/* Chrome rack gear */}
          <div className="absolute right-[7%] top-4 hidden gap-2 sm:flex">
            <ChromeUnit active={active} level={level} />
            <ChromeUnit active={active} level={level} />
          </div>
        </div>

        {/* Desk front */}
        <div className="h-24 rounded-b-xl border border-zinc-900 bg-gradient-to-b from-black to-zinc-950 shadow-[0_30px_70px_rgba(0,0,0,.9)]" />

        {/* Desk orange underglow */}
        <div
          className="absolute -bottom-3 left-[8%] right-[8%] h-1 rounded-full bg-orange-500 blur-md transition-opacity duration-500"
          style={{
            opacity: active
              ? Math.min(0.8, 0.25 + level)
              : 0.18,
          }}
        />
      </div>

      {/* Floor */}
      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-b from-zinc-950 to-black" />

      {/* Floor reflection */}
      <div className="absolute bottom-[4%] left-1/2 h-24 w-[55%] -translate-x-1/2 rounded-full bg-orange-500/[0.035] blur-3xl" />

      {/* Room vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.45)_75%,rgba(0,0,0,.85)_100%)]" />
    </div>
  );
}

/* ============================================================
   RACK EQUIPMENT
   ============================================================ */

function Rack({
  level,
  active,
}: {
  level: number;
  active: boolean;
}) {
  const activeLights = Math.ceil(
    level * 6,
  );

  return (
    <div className="h-20 w-24 rounded border border-zinc-700 bg-gradient-to-b from-zinc-700/30 to-black p-2 shadow-xl">
      <div className="space-y-2">
        {/* LEDs */}
        <div className="flex gap-1">
          {Array.from({ length: 6 }).map(
            (_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full transition-all duration-75"
                style={{
                  backgroundColor:
                    active &&
                    i < activeLights
                      ? "rgb(249 115 22)"
                      : "rgb(63 63 70)",
                  boxShadow:
                    active &&
                    i < activeLights
                      ? "0 0 7px rgba(249,115,22,.55)"
                      : "none",
                }}
              />
            ),
          )}
        </div>

        {/* Level bar */}
        <div className="h-1 rounded bg-zinc-800">
          <div
            className="h-full rounded bg-orange-500/50 transition-all duration-75"
            style={{
              width: `${
                active ? level * 100 : 0
              }%`,
            }}
          />
        </div>

        {/* Hardware controls */}
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map(
            (_, i) => (
              <span
                key={i}
                className="h-2 w-5 rounded-sm border border-zinc-700 bg-black"
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CHROME HARDWARE
   ============================================================ */

function ChromeUnit({
  level,
  active,
}: {
  level: number;
  active: boolean;
}) {
  return (
    <div className="h-14 w-16 rounded border border-zinc-500/50 bg-gradient-to-b from-zinc-400/20 via-zinc-800 to-black p-2 shadow-lg">
      <div className="flex justify-between">
        <span
          className="h-2 w-2 rounded-full transition-all duration-75"
          style={{
            backgroundColor:
              active && level > 0.05
                ? "rgb(249 115 22)"
                : "rgb(82 82 91)",
            boxShadow:
              active && level > 0.05
                ? "0 0 8px rgba(249,115,22,.65)"
                : "none",
          }}
        />

        <span className="h-2 w-2 rounded-full bg-zinc-600" />
      </div>

      <div className="mt-3 h-1 rounded bg-zinc-700">
        <div
          className="h-full rounded bg-orange-500/50 transition-all duration-75"
          style={{
            width: `${
              active ? level * 100 : 8
            }%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MIXING CONSOLE
   ============================================================ */

function MixingConsole({
  level,
  active,
}: {
  level: number;
  active: boolean;
}) {
  const channels = [
    1, 2, 3, 4, 5, 6, 7, 8,
  ];

  return (
    <div className="absolute left-[8%] top-3 h-20 w-[52%] rounded-lg border border-zinc-600/50 bg-gradient-to-br from-zinc-500/20 via-zinc-900 to-black p-3 shadow-2xl">
      <div className="flex h-full gap-2">
        {channels.map((channel) => {
          const meterHeight = active
            ? Math.min(
                92,
                12 +
                  level *
                    (45 + channel * 4),
              )
            : 8;

          return (
            <div
              key={channel}
              className="flex flex-1 flex-col items-center gap-1"
            >
              {/* Channel LED */}
              <span
                className="h-1.5 w-1.5 rounded-full transition-all duration-75"
                style={{
                  backgroundColor:
                    active && level > 0.08
                      ? "rgb(249 115 22)"
                      : "rgb(82 82 91)",
                  boxShadow:
                    active && level > 0.08
                      ? "0 0 8px rgba(249,115,22,.65)"
                      : "none",
                }}
              />

              {/* Meter */}
              <div className="relative flex h-11 w-1.5 items-end overflow-hidden rounded-full bg-black">
                <span
                  className="w-full rounded-full bg-gradient-to-t from-zinc-600 via-orange-500 to-red-500 transition-all duration-75"
                  style={{
                    height: `${meterHeight}%`,
                  }}
                />
              </div>

              {/* Fader */}
              <span
                className="h-1 w-3 rounded bg-zinc-700 transition-all duration-100"
                style={{
                  transform: `translateY(${
                    active
                      ? level * -3
                      : 0
                  }px)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}