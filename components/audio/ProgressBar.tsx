"use client";

import { useAudio } from "./AudioContext";

export default function ProgressBar() {
  const {
    currentTime,
    duration,
    seek,
  } = useAudio();

  return (
    <input
      type="range"
      min={0}
      max={duration || 0}
      value={currentTime}
      onChange={(e) =>
        seek(Number(e.target.value))
      }
      className="w-full cursor-pointer accent-orange-500"
    />
  );
}