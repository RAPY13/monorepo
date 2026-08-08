"use client";

import { Play, Clock3 } from "lucide-react";

import { useAudio } from "@/components/audio";
import type { RecordingTake } from "@/lib/audio/types";

type RecordingCardProps = {
  recording: RecordingTake;
};

export default function RecordingCard({
  recording,
}: RecordingCardProps) {
  const { play } = useAudio();

  const minutes = Math.floor(recording.duration / 60);

  const seconds = Math.floor(recording.duration % 60)
    .toString()
    .padStart(2, "0");

  async function handlePlay() {
    await play({
      ...recording,
      url: recording.storage_path,
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-900 bg-zinc-950 p-5 transition hover:border-orange-500/30">
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-white">
          {recording.title || "Untitled Recording"}
        </h3>

        <div className="mt-2 flex items-center gap-4 text-sm text-zinc-500">
          <span>
            {minutes}:{seconds}
          </span>

          <span className="flex items-center gap-1">
            <Clock3 size={14} />

            {new Date(
              recording.created_at,
            ).toLocaleDateString()}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePlay}
        aria-label={`Play ${
          recording.title || "recording"
        }`}
        className="
          shrink-0
          rounded-full
          bg-orange-500
          p-3
          text-black
          transition
          hover:bg-orange-400
          focus:outline-none
          focus:ring-2
          focus:ring-orange-500
          focus:ring-offset-2
          focus:ring-offset-black
        "
      >
        <Play size={18} />
      </button>
    </div>
  );
}