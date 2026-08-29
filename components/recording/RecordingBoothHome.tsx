import Link from "next/link";
import Image from "next/image";
import { Mic2, Plus, Waves } from "lucide-react";

export default function RecordingBoothHome() {
  return (
    <section className="min-h-full bg-black px-6 py-10 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative mb-10 min-h-[280px] overflow-hidden border border-zinc-900 bg-zinc-950 md:min-h-[360px]">
          <Image
            src="/images/booth/studio-booth.webp"
            alt="RapYard studio booth"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
          <div className="relative flex min-h-[280px] max-w-xl flex-col justify-end p-7 md:min-h-[360px] md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-400">Studio</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">Your Room. Your Take.</h2>
            <Link href="/booth?instant=1" className="mt-6 inline-flex w-fit items-center gap-3 border border-orange-400 bg-orange-500 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition hover:bg-orange-400">
              <Mic2 className="h-4 w-4" /> Record Instantly
            </Link>
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
            Recording Booth
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Step into the Booth.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
            Create a project, open a recording session, and start building
            your next track inside RapYard.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Link
            href="/projects"
            className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-7 transition hover:border-orange-500/40 hover:bg-zinc-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Plus className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-xl font-black text-white">
              Choose a Project
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Open an existing project and continue recording.
            </p>

            <div className="mt-6 text-xs font-black uppercase tracking-wider text-orange-500">
              View Projects →
            </div>
          </Link>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-500">
              <Mic2 className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-xl font-black text-white">
              Recording Sessions
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Your takes, sessions, and recording history will live here.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-700">
              <Waves className="h-4 w-4" />
              Booth Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}