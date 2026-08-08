"use client";

import { Pause, Play, Square } from "lucide-react";

import { useAudio } from "./AudioContext";
import ProgressBar from "./ProgressBar";
import TimeDisplay from "./TimeDisplay";
import VolumeSlider from "./VolumeSlider";

export default function AudioPlayer() {
  const {
    currentTrack,
    audio,
    playing,
    loading,
    pause,
    resume,
    stop,
  } = useAudio();

  // Nothing selected
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        {/* Track */}
        <div className="mb-4">
          <h3 className="truncate text-lg font-bold">
            {currentTrack.title}
          </h3>

          <p className="text-sm text-zinc-500">
            RapYard Recording
          </p>
        </div>

        {/* Progress */}
        <ProgressBar />

        <div className="mt-2">
          <TimeDisplay />
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Playback */}
          <div className="flex items-center gap-3">
            {playing ? (
              <button
                onClick={pause}
                className="rounded-full bg-orange-500 p-3 transition hover:bg-orange-400"
                aria-label="Pause"
              >
                <Pause size={20} />
              </button>
            ) : (
              <button
                onClick={resume}
                disabled={loading}
                className="rounded-full bg-orange-500 p-3 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Play"
              >
                <Play size={20} />
              </button>
            )}

            <button
              onClick={stop}
              className="rounded-full bg-zinc-800 p-3 transition hover:bg-zinc-700"
              aria-label="Stop"
            >
              <Square size={18} />
            </button>
          </div>

          {/* Volume */}
          <VolumeSlider audio={audio} />
        </div>
      </div>
    </div>
  );
}