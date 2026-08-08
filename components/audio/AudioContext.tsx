"use client";

import {
  createContext,
  useContext,
} from "react";

import type { RecordingTake } from "@/lib/audio/types";

export type AudioRecording = RecordingTake & {
  url: string;
};

export interface AudioContextType {
  currentTrack: AudioRecording | null;

  audio: HTMLAudioElement | null;

  playing: boolean;
  loading: boolean;

  duration: number;
  currentTime: number;
  progress: number;

  volume: number;

  play: (recording: AudioRecording) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;

  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
}

export const AudioContext =
  createContext<AudioContextType | null>(null);

export function useAudio(): AudioContextType {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error(
      "useAudio must be used inside an AudioProvider."
    );
  }

  return context;
}