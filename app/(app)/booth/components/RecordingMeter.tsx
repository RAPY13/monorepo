"use client";

import { useEffect, useRef, useState } from "react";

import { Mic } from "lucide-react";

import { useRecording } from "./RecordingContext";

export default function RecordingMeter() {
  const { stream } = useRecording();

  const [level, setLevel] = useState(0);

  const analyserRef = useRef<AnalyserNode | null>(null);

  const animationRef = useRef<number | null>(null);

  useEffect(() => {
  if (!stream) {
    setLevel(0);
    return;
  }

  const audioContext = new AudioContext();

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source =
    audioContext.createMediaStreamSource(stream);

  source.connect(analyser);

  analyserRef.current = analyser;

  const dataArray = new Uint8Array(
    analyser.frequencyBinCount
  );

  const updateMeter = () => {
    analyser.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce(
        (sum, value) => sum + value,
        0
      ) / dataArray.length;

    setLevel(Math.min(100, average));

    animationRef.current =
      requestAnimationFrame(updateMeter);
  };

  updateMeter();

  return () => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    source.disconnect();
    analyser.disconnect();
    audioContext.close();
  };
}, [stream]);

  return (
    <div>

      <div className="mb-6 flex items-center gap-3">

        <Mic
          className="text-orange-500"
          size={22}
        />

        <h3 className="text-lg font-bold">
          Input Meter
        </h3>

      </div>

      {/* Meter */}

      <div className="relative h-6 overflow-hidden rounded-full bg-zinc-900">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-green-500
            via-yellow-400
            to-red-500
            transition-all
            duration-75
          "
          style={{
            width: `${level}%`,
          }}
        />

      </div>

      <div className="mt-3 flex justify-between text-xs text-zinc-500">

        <span>Quiet</span>

        <span>Optimal</span>

        <span>Clipping</span>

      </div>

    </div>
  );
}