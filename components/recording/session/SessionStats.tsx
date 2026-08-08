import {
  Clock3,
  Mic2,
} from "lucide-react";

import type { RecordingTake } from "@/lib/audio/types";

type Props = {
  takes: RecordingTake[];
};

function formatDuration(seconds: number) {
  const totalSeconds = Math.max(
    0,
    Math.round(seconds),
  );

  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const remainingSeconds = String(
    totalSeconds % 60,
  ).padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

export default function SessionStats({
  takes,
}: Props) {
  const totalDuration = takes.reduce(
    (total, take) =>
      total + (take.duration || 0),
    0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
            <Mic2 size={18} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              Takes
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {takes.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-500">
            <Clock3 size={18} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              Recorded Time
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              {formatDuration(totalDuration)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}