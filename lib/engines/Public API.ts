export type WaveformData = {
  samples: number[];
  sampleRate: number;
};

export abstract class RecordingEngine {
  abstract start(): Promise<void>;

  abstract pause(): void;

  abstract resume(): void;

  abstract stop(): Promise<Blob>;

  abstract cancel(): void;

  abstract isRecording(): boolean;

  abstract getDuration(): number;

  abstract getWaveform(): WaveformData;
}