"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mic2,
} from "lucide-react";

type Session = {
  id: string;
  project_id: string;
  title: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  sessions: Session[];
};

export default function SessionList({
  sessions,
}: Props) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">
            Project History
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
            Recording Sessions
          </h2>
        </div>

        <span className="text-xs font-semibold text-zinc-600">
          {sessions.length}{" "}
          {sessions.length === 1
            ? "session"
            : "sessions"}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-black">
            <Mic2
              size={18}
              className="text-zinc-600"
            />
          </div>

          <h3 className="mt-4 text-sm font-bold text-zinc-300">
            No recording sessions yet
          </h3>

          <p className="mt-2 text-xs text-zinc-600">
            Start a recording session from
            the Booth.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.id}`}
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-zinc-900
                bg-zinc-950
                p-5
                transition
                hover:border-zinc-700
                hover:bg-zinc-900/60
              "
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <Mic2 size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-white">
                  {session.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                  <Clock3 size={12} />

                  {new Date(
                    session.created_at,
                  ).toLocaleDateString()}
                </div>
              </div>

              <ArrowRight
                size={18}
                className="shrink-0 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-orange-500"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}