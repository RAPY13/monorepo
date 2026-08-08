"use client";

import { createContext, useContext } from "react";

export type RecordingStatus =
  | "idle"
  | "recording"
  | "paused"
  | "playing"
  | "saving";

export interface RecordingContextValue {
  status: RecordingStatus;

  duration: number;

  stream: MediaStream | null;

  recorder: MediaRecorder | null;

  blob: Blob | null;

  audioUrl: string | null;

  /* ------------------------------------ */
  /* Shared Web Audio API Objects */
  /* ------------------------------------ */

  audioContext: AudioContext | null;

  analyser: AnalyserNode | null;

  frequencyData: Uint8Array | null;

  timeDomainData: Uint8Array | null;

  /* ------------------------------------ */

  isRecording: boolean;

  isPaused: boolean;

  isPlaying: boolean;

  /* ------------------------------------ */

  startRecording: () => Promise<void>;

  stopRecording: () => void;

  pauseRecording: () => void;

  resumeRecording: () => void;

  playRecording: () => void;

  pausePlayback: () => void;

  discardRecording: () => void;

  saveRecording: () => Promise<void>;
}

export const RecordingContext =
  createContext<RecordingContextValue | null>(
    null
  );

export function useRecording() {
  const context = useContext(
    RecordingContext
  );

  if (!context) {
    throw new Error(
      "useRecording must be used inside RecordingProvider."
    );
  }

  return context;
}