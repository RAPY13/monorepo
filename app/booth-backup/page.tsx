import BottomNav from "@/app/components/BottomNav";
import {
  Headphones,
  Mic2,
  MonitorSpeaker,
  Play,
  Settings2,
  Volume2,
} from "lucide-react";

export default function BoothPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white pb-24">
      {/* Ambient studio lighting */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-orange-500/[0.045] blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-orange-900/[0.025] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        {/* Top navigation */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
              RapYard
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-700">
              Digital Recording Room
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-white/[0.07] bg-zinc-950/80 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Booth Ready
            </span>
          </div>
        </header>

        {/* Main studio */}
        <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#090909] shadow-2xl shadow-black/60">
          {/* Studio header */}
          <div className="flex flex-col gap-5 border-b border-white/[0.07] px-6 py-7 sm:px-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500">
                Recording Room
              </p>

              <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                The Booth
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                Your room. Your take. Your sound.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-600">
              <span className="rounded-full border border-white/[0.07] px-4 py-2">
                SESSION 01
              </span>

              <span className="rounded-full border border-white/[0.07] px-4 py-2">
                UNTITLED
              </span>
            </div>
          </div>

          {/* Recording room */}
          <div className="relative min-h-[620px] overflow-hidden">
            {/* Acoustic wall treatment */}
            <div className="absolute inset-0 opacity-[0.22]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,.035) 50%, transparent 100%), repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0px, rgba(255,255,255,.025) 2px, transparent 2px, transparent 90px)",
                }}
              />
            </div>

            {/* Orange room glow */}
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.025] blur-[100px]" />

            {/* Studio frame */}
            <div className="relative mx-auto flex min-h-[620px] max-w-5xl flex-col items-center justify-center px-5 py-16">
              {/* Microphone */}
              <div className="relative flex h-[230px] w-[170px] items-center justify-center">
                <div className="absolute h-[190px] w-[110px] rounded-[45%] border border-zinc-700 bg-gradient-to-b from-zinc-700/30 via-zinc-950 to-black shadow-[0_30px_80px_rgba(0,0,0,.8)]" />

                <div className="absolute top-[38px] h-[120px] w-[74px] rounded-[42%] border border-zinc-600 bg-black shadow-inner">
                  <div className="absolute inset-x-3 top-4 bottom-4 rounded-[40%] border border-zinc-800" />

                  <div className="absolute inset-x-5 top-7 bottom-7 rounded-[40%] border border-zinc-900" />
                </div>

                <div className="absolute top-[150px] h-[55px] w-[4px] rounded-full bg-zinc-700" />

                <div className="absolute bottom-2 h-3 w-28 rounded-full bg-zinc-800/70 blur-[1px]" />

                <div className="absolute -right-4 top-8 h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,.8)]" />
              </div>

              {/* Live waveform */}
              <div className="mt-4 flex h-24 w-full max-w-3xl items-center justify-center gap-[3px] overflow-hidden px-4 opacity-80">
                {[
                  18, 28, 12, 42, 25, 55, 34, 70, 45, 28,
                  62, 37, 78, 48, 30, 65, 42, 86, 55, 32,
                  72, 45, 24, 58, 38, 68, 30, 80, 42, 24,
                  62, 36, 72, 48, 28, 55, 38, 70, 30, 46,
                  22, 58, 34, 75, 44, 26, 62, 38, 52, 24,
                  42, 30, 65, 36, 58, 28, 72, 40, 20, 48,
                ].map((height, index) => (
                  <span
                    key={index}
                    className="w-[3px] rounded-full bg-orange-500/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="mt-8 text-center">
                <p className="font-mono text-5xl font-black tracking-tight sm:text-6xl">
                  00:00.00
                </p>

                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-700">
                  Ready to record
                </p>
              </div>

              {/* Record button */}
              <button
                type="button"
                className="group mt-10 flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500 text-black shadow-[0_0_60px_rgba(249,115,22,.15)] transition hover:scale-105 hover:bg-orange-400"
                aria-label="Start recording"
              >
                <span className="h-7 w-7 rounded-full bg-black transition group-hover:scale-110" />
              </button>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                Start Recording
              </p>
            </div>
          </div>

          {/* Studio controls */}
          <div className="grid border-t border-white/[0.07] sm:grid-cols-3">
            <StudioControl
              icon={<Mic2 size={18} />}
              label="Input"
              value="Built-in Microphone"
            />

            <StudioControl
              icon={<Headphones size={18} />}
              label="Monitoring"
              value="On"
            />

            <StudioControl
              icon={<Volume2 size={18} />}
              label="Input Level"
              value="Ready"
            />
          </div>
        </section>

        {/* Current session */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Takes */}
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/80">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-6 sm:px-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
                  Session
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Your Takes
                </h2>
              </div>

              <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                0 Takes
              </span>
            </div>

            <div className="flex min-h-[180px] items-center justify-center px-6 py-10">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-black text-zinc-700">
                  <Play size={20} />
                </div>

                <p className="mt-5 text-sm font-bold text-zinc-500">
                  No takes yet
                </p>

                <p className="mt-2 text-xs text-zinc-700">
                  Your recordings will appear here.
                </p>
              </div>
            </div>
          </div>

          {/* Session information */}
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
                  Current Session
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Untitled
                </h2>
              </div>

              <Settings2
                size={19}
                className="text-zinc-700"
              />
            </div>

            <div className="mt-8 space-y-5">
              <InfoRow
                label="Status"
                value="Ready"
              />

              <InfoRow
                label="Input"
                value="Built-in Microphone"
              />

              <InfoRow
                label="Monitoring"
                value="On"
              />

              <InfoRow
                label="Takes"
                value="0"
              />
            </div>

            <button
              type="button"
              className="mt-8 w-full rounded-2xl border border-white/[0.08] px-5 py-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-500 transition hover:border-zinc-600 hover:text-white"
            >
              Session Settings
            </button>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mt-8 rounded-3xl border border-orange-500/15 bg-orange-500/[0.025] p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-orange-500">
            The Booth
          </p>

          <p className="mt-3 text-xl font-black uppercase">
            Your room. Your take. Your sound.
          </p>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            Step in, press record, and make something worth
            keeping.
          </p>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}

function StudioControl({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-white/[0.07] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-black text-zinc-500">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
          {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-zinc-400">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
      <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-700">
        {label}
      </span>

      <span className="text-xs font-semibold text-zinc-400">
        {value}
      </span>
    </div>
  );
}