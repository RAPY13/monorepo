"use client";

import { useAudio } from "./AudioContext";

function format(seconds: number) {
  if (!Number.isFinite(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function TimeDisplay() {
  const {
    currentTime,
    duration,
  } = useAudio();

  return (
    <div className="flex justify-between text-xs text-zinc-500">
      <span>{format(currentTime)}</span>
      <span>{format(duration)}</span>
    </div>
  );
}