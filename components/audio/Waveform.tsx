"use client";

type WaveformProps = {
  recording: boolean;
};

export default function Waveform({
  recording,
}: WaveformProps) {
  const bars = Array.from({ length: 72 });

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">

        <div>
          <h3 className="font-semibold text-white">
            Live Waveform
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            {recording
              ? "Capturing microphone input..."
              : "Waiting for recording"}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
            recording
              ? "bg-red-500/10 text-red-400"
              : "bg-zinc-900 text-zinc-500"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              recording
                ? "animate-pulse bg-red-500"
                : "bg-zinc-600"
            }`}
          />

          {recording ? "Recording" : "Standby"}
        </div>

      </div>

      {/* Waveform */}

      <div className="relative h-72 overflow-hidden px-8 py-8">

        {/* Background Grid */}

        <div className="absolute inset-0 opacity-10">

          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

        </div>

        {/* Center Line */}

        <div className="absolute left-0 right-0 top-1/2 h-px bg-zinc-700" />

        {/* Playhead */}

        {recording && (
          <div className="absolute bottom-0 top-0 left-1/2 z-20">

            <div className="h-full w-[2px] animate-pulse bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,.7)]" />

          </div>
        )}

        {/* Wave */}

        <div className="relative flex h-full items-center justify-center gap-[3px]">

          {bars.map((_, index) => {
            const height =
              18 + ((index * 29) % 120);

            return (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  recording
                    ? "animate-pulse bg-orange-500"
                    : "bg-zinc-700"
                }`}
                style={{
                  width: "5px",
                  height: `${height}px`,
                  animationDelay: `${index * 25}ms`,
                  opacity: recording ? 1 : 0.35,
                }}
              />
            );
          })}

        </div>

      </div>

      {/* Timeline */}

      <div className="border-t border-zinc-800 px-8 py-5">

        <div className="flex justify-between text-xs text-zinc-500">

          <span>0:00</span>

          <span>0:15</span>

          <span>0:30</span>

          <span>0:45</span>

          <span>1:00</span>

        </div>

      </div>

    </div>
  );
}