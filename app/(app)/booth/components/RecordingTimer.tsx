"use client";

import { Clock3 } from "lucide-react";
import { useRecording } from "./RecordingContext";

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hrs, mins, secs]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
}

export default function RecordingTimer() {
  const {
    duration,
    isRecording,
    isPaused,
  } = useRecording();

  return (
    <div className="flex items-center justify-between">

      <div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
          Recording Time
        </p>

        <h2 className="mt-3 font-mono text-5xl font-black tracking-wider">
          {formatTime(duration)}
        </h2>

      </div>

      <div className="flex items-center gap-3">

        <span
          className={`
            h-4
            w-4
            rounded-full

            ${
              isRecording
                ? "animate-pulse bg-red-500"
                : isPaused
                ? "bg-yellow-500"
                : "bg-zinc-700"
            }
          `}
        />

        <span className="font-semibold text-zinc-400">

          {isRecording
            ? "Recording"
            : isPaused
            ? "Paused"
            : "Idle"}

        </span>

      </div>

    </div>
  );
}