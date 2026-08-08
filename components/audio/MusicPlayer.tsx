"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music2,
} from "lucide-react";

import { useAudio } from "./AudioContext";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    currentTrack,
    playing,
    currentTime,
    duration,
    progress,
    volume,
    pause,
    resume,
    seek,
    setVolume,
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <footer className="sticky bottom-0 z-50 border-t border-zinc-800 bg-black/95 backdrop-blur-xl">

      <div className="mx-auto flex h-24 max-w-screen-2xl items-center justify-between gap-8 px-8">

        {/* Track */}

        <div className="flex min-w-[240px] items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10">

            <Music2
              size={24}
              className="text-orange-500"
            />

          </div>

          <div>

            <p className="font-semibold">
              {currentTrack.title}
            </p>

            <p className="text-sm text-zinc-500">
              RapYard Recording
            </p>

          </div>

        </div>

        {/* Controls */}

        <div className="flex flex-1 flex-col items-center">

          <div className="flex items-center gap-6">

            <button className="text-zinc-500 transition hover:text-white">
              <SkipBack size={20} />
            </button>

            <button
              onClick={playing ? pause : resume}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-black transition hover:bg-orange-400"
            >
              {playing ? (
                <Pause size={22} />
              ) : (
                <Play size={22} />
              )}
            </button>

            <button className="text-zinc-500 transition hover:text-white">
              <SkipForward size={20} />
            </button>

          </div>

          <div className="mt-3 flex w-full max-w-lg items-center gap-3">

            <span className="w-10 text-xs text-zinc-500">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) =>
                seek(Number(e.target.value))
              }
              className="flex-1 accent-orange-500"
            />

            <span className="w-10 text-right text-xs text-zinc-500">
              {formatTime(duration)}
            </span>

          </div>

        </div>

        {/* Volume */}

        <div className="flex min-w-[180px] items-center gap-4">

          <Volume2
            size={20}
            className="text-zinc-500"
          />

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) =>
              setVolume(Number(e.target.value))
            }
            className="w-full accent-orange-500"
          />

        </div>

      </div>

      {/* Progress Bar */}

      <div className="h-1 bg-zinc-900">

        <div
          className="h-full bg-orange-500 transition-all"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </footer>
  );
}