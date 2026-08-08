import { RecordingEngine } from "./Public API";
import type { WaveformData } from "./Public API";

export class BrowserRecordingEngine
  extends RecordingEngine {
  private mediaRecorder: MediaRecorder | null = null;

  private stream: MediaStream | null = null;

  private chunks: Blob[] = [];

  private startedAt = 0;

  private accumulatedDuration = 0;

  private recording = false;

  private waveform: WaveformData = {
    samples: [],
    sampleRate: 0,
  };

  async start(): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error(
        "Recording is only available in the browser.",
      );
    }

    if (this.recording) {
      return;
    }

    this.stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    this.chunks = [];

    const mimeType =
      MediaRecorder.isTypeSupported(
        "audio/webm;codecs=opus",
      )
        ? "audio/webm;codecs=opus"
        : "audio/webm";

    this.mediaRecorder =
      new MediaRecorder(this.stream, {
        mimeType,
      });

    this.mediaRecorder.ondataavailable = (
      event,
    ) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);

    this.startedAt = performance.now();
    this.recording = true;
  }

  pause(): void {
    if (
      !this.mediaRecorder ||
      this.mediaRecorder.state !== "recording"
    ) {
      return;
    }

    this.accumulatedDuration +=
      performance.now() - this.startedAt;

    this.mediaRecorder.pause();
  }

  resume(): void {
    if (
      !this.mediaRecorder ||
      this.mediaRecorder.state !== "paused"
    ) {
      return;
    }

    this.startedAt = performance.now();

    this.mediaRecorder.resume();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const recorder = this.mediaRecorder;

      if (!recorder) {
        reject(
          new Error("No recording is active."),
        );
        return;
      }

      if (recorder.state === "recording") {
        this.accumulatedDuration +=
          performance.now() - this.startedAt;
      }

      const finish = () => {
        const blob = new Blob(this.chunks, {
          type:
            recorder.mimeType ||
            "audio/webm",
        });

        this.recording = false;

        this.stream?.getTracks().forEach(
          (track) => track.stop(),
        );

        this.stream = null;
        this.mediaRecorder = null;

        resolve(blob);
      };

      recorder.onstop = finish;

      recorder.onerror = () => {
        this.recording = false;

        this.stream?.getTracks().forEach(
          (track) => track.stop(),
        );

        this.stream = null;
        this.mediaRecorder = null;

        reject(
          new Error(
            "The recording could not be completed.",
          ),
        );
      };

      recorder.stop();
    });
  }

  cancel(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onerror = null;

      if (
        this.mediaRecorder.state !==
        "inactive"
      ) {
        this.mediaRecorder.stop();
      }
    }

    this.stream?.getTracks().forEach(
      (track) => track.stop(),
    );

    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];

    this.recording = false;
    this.startedAt = 0;
    this.accumulatedDuration = 0;
  }

  isRecording(): boolean {
    return this.recording;
  }

  getDuration(): number {
    if (!this.recording) {
      return this.accumulatedDuration / 1000;
    }

    return (
      this.accumulatedDuration +
      (performance.now() - this.startedAt)
    ) / 1000;
  }

  getWaveform(): WaveformData {
    return this.waveform;
  }
}