"use client";

import { useEffect, useState } from "react";
import {
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";

type VolumeSliderProps = {
  audio: HTMLAudioElement | null;
};

export default function VolumeSlider({
  audio,
}: VolumeSliderProps) {
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!audio) return;

    audio.volume = volume;
  }, [audio, volume]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = Number(event.target.value);

    setVolume(value);

    if (audio) {
      audio.volume = value;
    }
  }

  function VolumeIcon() {
    if (volume === 0) {
      return <VolumeX size={18} />;
    }

    if (volume < 0.5) {
      return <Volume1 size={18} />;
    }

    return <Volume2 size={18} />;
  }

  return (
    <div className="flex items-center gap-3">

      <VolumeIcon />

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={handleChange}
        className="h-2 w-28 cursor-pointer accent-orange-500"
        aria-label="Volume"
      />

    </div>
  );
}