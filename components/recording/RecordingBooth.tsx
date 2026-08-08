"use client";

import { createClient } from "@/lib/supabase/client";
import { getSessionTakes } from "@/lib/takes/getSessionTakes";
import { uploadRecording } from "@/lib/audio/uploadRecording";
import type { RecordingTake } from "@/lib/audio/types";
import {
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  projectId: string;
  sessionId: string;
};

type BoothState =
  | "ready"
  | "recording"
  | "paused"
  | "complete";

export default function RecordingBooth({
  projectId,
  sessionId,
}: Props) {
  const [state, setState] =
    useState<BoothState>("ready");

  const [duration, setDuration] =
    useState(0);

  const [recordingBlob, setRecordingBlob] =
    useState<Blob | null>(null);

  const [audioUrl, setAudioUrl] =
    useState<string | null>(null);

  const [takes, setTakes] =
    useState<RecordingTake[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const [error, setError] =
    useState("");

  const [inputLevel, setInputLevel] =
    useState(0);

  const recorderRef =
    useRef<MediaRecorder | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  const animationRef =
    useRef<number | null>(null);

  const timerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  const startedAtRef =
    useRef<number | null>(null);

  const accumulatedRef =
    useRef(0);

  /*
   * Load existing session takes.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadTakes() {
      try {
        const existing =
          await getSessionTakes(sessionId);

        if (!cancelled) {
          setTakes(existing);
        }
      } catch (loadError) {
        console.error(
          "[Booth] Failed to load takes:",
          loadError,
        );
      }
    }

    void loadTakes();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  /*
   * Cleanup browser resources.
   */
  useEffect(() => {
    return () => {
      stopTimer();
      stopMeter();

      streamRef.current?.getTracks().forEach(
        (track) => track.stop(),
      );

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  /*
   * Start recording.
   */
  async function startRecording() {
    try {
      setError("");
      setSaveError("");

      if (
        typeof window === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error(
          "Microphone recording is not supported in this browser.",
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      chunksRef.current = [];

      const mimeType =
        MediaRecorder.isTypeSupported(
          "audio/webm;codecs=opus",
        )
          ? "audio/webm;codecs=opus"
          : "audio/webm";

      const recorder =
        new MediaRecorder(stream, {
          mimeType,
        });

      recorderRef.current = recorder;

      recorder.ondataavailable = (
        event,
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(
            event.data,
          );
        }
      };

      recorder.onerror = () => {
        setError(
          "Something went wrong while recording.",
        );

        cleanupRecording();
        setState("ready");
      };

      recorder.onstop = () => {
        const blob = new Blob(
          chunksRef.current,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          },
        );

        if (blob.size === 0) {
          setError(
            "The recording was empty.",
          );

          cleanupRecording();
          setState("ready");
          return;
        }

        const url =
          URL.createObjectURL(blob);

        setRecordingBlob(blob);

        setAudioUrl((previous) => {
          if (previous) {
            URL.revokeObjectURL(previous);
          }

          return url;
        });

        cleanupRecording();
        setState("complete");
      };

      /*
       * Microphone input meter.
       */
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (AudioContextClass) {
        const audioContext =
          new AudioContextClass();

        const source =
          audioContext.createMediaStreamSource(
            stream,
          );

        const analyser =
          audioContext.createAnalyser();

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant =
          0.8;

        source.connect(analyser);

        audioContextRef.current =
          audioContext;

        analyserRef.current =
          analyser;

        startMeter();
      }

      accumulatedRef.current = 0;

      startedAtRef.current =
        performance.now();

      setDuration(0);

      recorder.start(100);

      startTimer();

      setState("recording");
    } catch (recordingError) {
      console.error(
        "[Booth] Recording failed:",
        recordingError,
      );

      setError(
        recordingError instanceof Error
          ? recordingError.message
          : "Microphone access was denied or unavailable.",
      );

      cleanupRecording();
      setState("ready");
    }
  }

  /*
   * Pause.
   */
  function pauseRecording() {
    const recorder =
      recorderRef.current;

    if (
      !recorder ||
      recorder.state !== "recording"
    ) {
      return;
    }

    if (startedAtRef.current !== null) {
      accumulatedRef.current +=
        performance.now() -
        startedAtRef.current;
    }

    startedAtRef.current = null;

    recorder.pause();

    stopTimer();

    setDuration(
      accumulatedRef.current / 1000,
    );

    setState("paused");
  }

  /*
   * Resume.
   */
  function resumeRecording() {
    const recorder =
      recorderRef.current;

    if (
      !recorder ||
      recorder.state !== "paused"
    ) {
      return;
    }

    recorder.resume();

    startedAtRef.current =
      performance.now();

    startTimer();

    setState("recording");
  }

  /*
   * Stop.
   */
  function stopRecording() {
    const recorder =
      recorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state === "recording" &&
      startedAtRef.current !== null
    ) {
      accumulatedRef.current +=
        performance.now() -
        startedAtRef.current;
    }

    startedAtRef.current = null;

    stopTimer();

    setDuration(
      accumulatedRef.current / 1000,
    );

    if (
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }
  }

  /*
   * Retake.
   */
  function retake() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(null);
    setRecordingBlob(null);

    setDuration(0);

    setError("");
    setSaveError("");

    chunksRef.current = [];

    accumulatedRef.current = 0;

    setState("ready");
  }

  /*
   * Save recording to existing
   * RapYard upload system.
   */
  async function saveTake() {
    if (!recordingBlob) {
      setSaveError(
        "There is no recording to save.",
      );
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const supabase =
        createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "You must be signed in to save a take.",
        );
      }

      const take =
        await uploadRecording({
          userId: user.id,
          projectId,
          sessionId,
          blob: recordingBlob,
          duration,
          title: `Take ${
            takes.length + 1
          }`,
        });

      setTakes((previous) => [
        ...previous,
        take as RecordingTake,
      ]);

      setState("complete");
    } catch (saveErrorValue) {
      console.error(
        "[Booth] Failed to save take:",
        saveErrorValue,
      );

      setSaveError(
        saveErrorValue instanceof Error
          ? saveErrorValue.message
          : "Unable to save your take.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Timer.
   */
  function startTimer() {
    stopTimer();

    timerRef.current =
      setInterval(() => {
        let elapsed =
          accumulatedRef.current;

        if (
          startedAtRef.current !== null
        ) {
          elapsed +=
            performance.now() -
            startedAtRef.current;
        }

        setDuration(
          elapsed / 1000,
        );
      }, 50);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(
        timerRef.current,
      );

      timerRef.current = null;
    }
  }

  /*
   * Live microphone level.
   */
  function startMeter() {
    const analyser =
      analyserRef.current;

    if (!analyser) {
      return;
    }

    const data =
      new Uint8Array(
        analyser.frequencyBinCount,
      );

    const update = () => {
      analyser.getByteTimeDomainData(
        data,
      );

      let sum = 0;

      for (const value of data) {
        const normalized =
          (value - 128) / 128;

        sum +=
          normalized *
          normalized;
      }

      const rms = Math.sqrt(
        sum / data.length,
      );

      setInputLevel(
        Math.min(1, rms * 4),
      );

      animationRef.current =
        requestAnimationFrame(
          update,
        );
    };

    update();
  }

  function stopMeter() {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current,
      );

      animationRef.current = null;
    }

    setInputLevel(0);

    analyserRef.current = null;

    if (audioContextRef.current) {
      void audioContextRef.current.close();

      audioContextRef.current = null;
    }
  }

  function cleanupRecording() {
    stopTimer();
    stopMeter();

    streamRef.current?.getTracks().forEach(
      (track) => track.stop(),
    );

    streamRef.current = null;
    recorderRef.current = null;
    startedAtRef.current = null;
  }

  const isActive =
    state === "recording" ||
    state === "paused";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] pb-16 text-white">
      {/* Ambient studio lighting */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className={`absolute left-1/2 top-[-220px] h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[150px] transition-all duration-1000 ${
            state === "recording"
              ? "bg-orange-500/[0.10]"
              : "bg-orange-500/[0.035]"
          }`}
        />

        {state === "recording" && (
          <div className="absolute inset-0 bg-orange-500/[0.015]" />
        )}
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-6 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
              RapYard
            </p>

            <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              The Booth
            </h1>

            <p className="mt-4 text-sm text-zinc-600">
              Your room. Your take. Your sound.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill state={state} />

            <div className="rounded-full border border-white/[0.07] bg-zinc-950 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Session Active
            </div>
          </div>
        </header>

        {/* Main room */}
        <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#090909] shadow-2xl shadow-black/60">
          {/* Session bar */}
          <div className="flex flex-col gap-4 border-b border-white/[0.07] px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700">
                Current Session
              </p>

              <p className="mt-2 text-sm font-bold text-zinc-300">
                Recording Session
              </p>
            </div>

            <div className="grid gap-2 text-right sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                  Project
                </p>

                <p className="mt-1 max-w-[220px] truncate text-xs text-zinc-500">
                  {projectId}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                  Session
                </p>

                <p className="mt-1 max-w-[220px] truncate text-xs text-zinc-500">
                  {sessionId}
                </p>
              </div>
            </div>
          </div>

          {/* Recording environment */}
          <div className="relative min-h-[650px] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0px, rgba(255,255,255,.025) 2px, transparent 2px, transparent 88px)",
                }}
              />
            </div>

            <div
              className={`absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-all duration-700 ${
                state === "recording"
                  ? "bg-orange-500/[0.08]"
                  : "bg-orange-500/[0.025]"
              }`}
            />

            <div className="relative flex min-h-[650px] flex-col items-center justify-center px-5 py-16">
              {/* Microphone */}
              <div className="relative h-[220px] w-[170px]">
                <div
                  className={`absolute left-1/2 top-5 h-[155px] w-[94px] -translate-x-1/2 rounded-[45%] border bg-gradient-to-b from-zinc-700/30 via-zinc-950 to-black shadow-[0_30px_80px_rgba(0,0,0,.8)] transition ${
                    state === "recording"
                      ? "border-orange-500/60 shadow-[0_0_70px_rgba(249,115,22,.12)]"
                      : "border-zinc-700"
                  }`}
                />

                <div className="absolute left-1/2 top-11 h-[112px] w-[64px] -translate-x-1/2 rounded-[42%] border border-zinc-600 bg-black">
                  <div className="absolute inset-x-3 top-4 bottom-4 rounded-[40%] border border-zinc-800" />

                  <div className="absolute inset-x-5 top-7 bottom-7 rounded-[40%] border border-zinc-900" />
                </div>

                <div className="absolute left-1/2 top-[158px] h-[52px] w-[4px] -translate-x-1/2 rounded-full bg-zinc-700" />

                <div className="absolute bottom-0 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-zinc-800 blur-[1px]" />

                <div
                  className={`absolute right-[23px] top-[32px] h-3 w-3 rounded-full transition ${
                    state === "recording"
                      ? "animate-pulse bg-red-500 shadow-[0_0_22px_rgba(239,68,68,.9)]"
                      : "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,.6)]"
                  }`}
                />
              </div>

              {/* Waveform */}
              <LiveWaveform
                active={isActive}
                level={inputLevel}
              />

              {/* Timer */}
              <div className="mt-8 text-center">
                <p className="font-mono text-5xl font-black tracking-tight sm:text-6xl">
                  {formatDuration(
                    duration,
                  )}
                </p>

                <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-700">
                  {state === "ready" &&
                    "Ready to record"}

                  {state === "recording" &&
                    "Recording"}

                  {state === "paused" &&
                    "Paused"}

                  {state === "complete" &&
                    "Take complete"}
                </p>
              </div>

              {/* Controls */}
              <div className="mt-10 flex items-center gap-4">
                {state === "ready" && (
                  <button
                    type="button"
                    onClick={
                      startRecording
                    }
                    className="group flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/50 bg-orange-500 text-black shadow-[0_0_70px_rgba(249,115,22,.16)] transition hover:scale-105 hover:bg-orange-400"
                    aria-label="Start recording"
                  >
                    <span className="h-7 w-7 rounded-full bg-black transition group-hover:scale-110" />
                  </button>
                )}

                {state === "recording" && (
                  <>
                    <button
                      type="button"
                      onClick={
                        pauseRecording
                      }
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12] bg-zinc-900 text-white transition hover:border-orange-500/40 hover:bg-zinc-800"
                      aria-label="Pause recording"
                    >
                      <Pause
                        size={21}
                        fill="currentColor"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        stopRecording
                      }
                      className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/40 bg-red-500 text-black shadow-[0_0_60px_rgba(239,68,68,.12)] transition hover:scale-105 hover:bg-red-400"
                      aria-label="Stop recording"
                    >
                      <Square
                        size={28}
                        fill="currentColor"
                      />
                    </button>
                  </>
                )}

                {state === "paused" && (
                  <>
                    <button
                      type="button"
                      onClick={
                        resumeRecording
                      }
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 transition hover:bg-orange-500 hover:text-black"
                      aria-label="Resume recording"
                    >
                      <Play
                        size={21}
                        fill="currentColor"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        stopRecording
                      }
                      className="flex h-24 w-24 items-center justify-center rounded-full border border-red-500/40 bg-red-500 text-black shadow-[0_0_60px_rgba(239,68,68,.12)] transition hover:scale-105 hover:bg-red-400"
                      aria-label="Stop recording"
                    >
                      <Square
                        size={28}
                        fill="currentColor"
                      />
                    </button>
                  </>
                )}

                {state === "complete" && (
                  <button
                    type="button"
                    onClick={retake}
                    className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-zinc-950 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-400 transition hover:border-orange-500/40 hover:text-white"
                  >
                    <RotateCcw size={16} />
                    Retake
                  </button>
                )}
              </div>

              <p className="mt-5 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
                {state === "ready" &&
                  "Start Recording"}

                {state === "recording" &&
                  "Capture Your Take"}

                {state === "paused" &&
                  "Recording Paused"}

                {state === "complete" &&
                  "Review Your Take"}
              </p>

              {error && (
                <div className="mt-8 max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-center text-xs leading-5 text-red-300">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Input controls */}
          <div className="grid border-t border-white/[0.07] sm:grid-cols-3">
            <StudioControl
              label="Input"
              value="Microphone"
            />

            <StudioControl
              label="Monitor"
              value="Browser Audio"
            />

            <StudioControl
              label="Level"
              value={
                inputLevel > 0.02
                  ? "Signal Detected"
                  : "Ready"
              }
              active={
                inputLevel > 0.02
              }
            />
          </div>
        </section>

        {/* Review */}
        {state === "complete" &&
          audioUrl &&
          recordingBlob && (
            <section className="mt-8 rounded-3xl border border-orange-500/20 bg-orange-500/[0.025] p-6 sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
                  Take Complete
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Review Your Take
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                  Listen back before saving it
                  to your session.
                </p>
              </div>

              <audio
                controls
                src={audioUrl}
                className="mt-6 w-full"
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={retake}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.08] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                  Retake
                </button>

                <button
                  type="button"
                  onClick={saveTake}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving
                    ? "Saving Take..."
                    : "Save Take"}
                </button>
              </div>

              {saveError && (
                <p className="mt-4 text-xs text-red-400">
                  {saveError}
                </p>
              )}
            </section>
          )}

        {/* Saved takes */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
                  Session
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase">
                  Your Takes
                </h2>
              </div>

              <span className="rounded-full border border-white/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                {takes.length}{" "}
                {takes.length === 1
                  ? "Take"
                  : "Takes"}
              </span>
            </div>

            <div className="mt-8">
              {takes.length === 0 ? (
                <div className="flex min-h-[170px] items-center justify-center rounded-2xl border border-white/[0.05] bg-black">
                  <div className="text-center">
                    <p className="text-sm font-bold text-zinc-600">
                      No saved takes yet.
                    </p>

                    <p className="mt-2 text-xs text-zinc-800">
                      Your recordings will
                      appear here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {takes.map((take) => (
                    <TakeRow
                      key={take.id}
                      take={take}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Session information */}
          <aside className="rounded-3xl border border-white/[0.08] bg-zinc-950/80 p-6 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500">
              Current Session
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase">
              Recording
            </h2>

            <div className="mt-8 space-y-5">
              <InfoRow
                label="Project"
                value={projectId}
              />

              <InfoRow
                label="Session"
                value={sessionId}
              />

              <InfoRow
                label="Status"
                value={
                  state === "complete"
                    ? "Take Complete"
                    : state === "recording"
                      ? "Recording"
                      : state === "paused"
                        ? "Paused"
                        : "Ready"
                }
              />

              <InfoRow
                label="Duration"
                value={formatDuration(
                  duration,
                )}
              />

              <InfoRow
                label="Saved Takes"
                value={String(
                  takes.length,
                )}
              />
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function TakeRow({
  take,
}: {
  take: RecordingTake;
}) {
  const [url, setUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function playTake() {
    setLoading(true);
    setError("");

    try {
      const supabase =
        createClient();

      const { data, error: urlError } =
        await supabase.storage
          .from("recordings")
          .createSignedUrl(
            take.storage_path,
            60 * 60,
          );

      if (urlError) {
        throw urlError;
      }

      setUrl(data.signedUrl);
    } catch (playbackError) {
      console.error(
        "[Booth] Playback URL failed:",
        playbackError,
      );

      setError(
        playbackError instanceof Error
          ? playbackError.message
          : "Unable to play this take.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-black p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500">
            Take{" "}
            {take.take_number}
          </p>

          <p className="mt-1 truncate text-sm font-bold text-zinc-300">
            {take.title ??
              `Take ${take.take_number}`}
          </p>

          <p className="mt-1 text-xs text-zinc-700">
            {formatDuration(
              take.duration,
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={playTake}
          disabled={loading}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 transition hover:border-orange-500/30 hover:text-white disabled:opacity-40"
        >
          <Play
            size={14}
            fill="currentColor"
          />

          {loading
            ? "Loading..."
            : "Play"}
        </button>
      </div>

      {url && (
        <audio
          controls
          autoPlay
          src={url}
          className="mt-4 w-full"
        />
      )}

      {error && (
        <p className="mt-3 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function LiveWaveform({
  active,
  level,
}: {
  active: boolean;
  level: number;
}) {
  const bars = [
    18, 32, 22, 46, 27, 58, 38, 72,
    42, 28, 64, 34, 78, 48, 30, 66,
    40, 84, 52, 35, 70, 44, 25, 58,
    36, 74, 30, 62, 42, 76, 24, 52,
    38, 68, 28, 58, 44, 80, 34, 64,
    22, 56, 40, 72, 30, 62, 46, 26,
  ];

  return (
    <div className="mt-2 flex h-24 w-full max-w-4xl items-center justify-center gap-[3px] overflow-hidden px-4">
      {bars.map(
        (height, index) => {
          const animatedHeight =
            active
              ? Math.max(
                  8,
                  height *
                    (0.35 + level),
                )
              : height * 0.35;

          return (
            <span
              key={index}
              className={`w-[3px] rounded-full transition-all duration-100 ${
                active
                  ? "bg-orange-500"
                  : "bg-orange-500/30"
              }`}
              style={{
                height: `${Math.min(
                  100,
                  animatedHeight,
                )}%`,
                opacity: active
                  ? 0.55 +
                    level * 0.45
                  : 0.45,
              }}
            />
          );
        },
      )}
    </div>
  );
}

function StatusPill({
  state,
}: {
  state: BoothState;
}) {
  const recording =
    state === "recording";

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-zinc-950 px-4 py-2">
      <span
        className={`h-2 w-2 rounded-full ${
          recording
            ? "animate-pulse bg-red-500 shadow-[0_0_12px_rgba(239,68,68,.8)]"
            : state === "complete"
              ? "bg-orange-500"
              : "bg-zinc-700"
        }`}
      />

      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
        {recording
          ? "Recording"
          : state === "paused"
            ? "Paused"
            : state === "complete"
              ? "Take Ready"
              : "Ready"}
      </span>
    </div>
  );
}

function StudioControl({
  label,
  value,
  active = false,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div className="border-b border-white/[0.07] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            active
              ? "bg-orange-500"
              : "bg-zinc-700"
          }`}
        />

        <p className="text-xs font-semibold text-zinc-400">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-white/[0.06] pb-4 last:border-0 last:pb-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-zinc-700">
        {label}
      </p>

      <p className="mt-1 break-all text-xs font-semibold text-zinc-400">
        {value}
      </p>
    </div>
  );
}

function formatDuration(
  seconds: number,
) {
  const minutes = Math.floor(
    seconds / 60,
  );

  const remaining =
    seconds % 60;

  const wholeSeconds =
    Math.floor(remaining);

  const milliseconds =
    Math.floor(
      (remaining - wholeSeconds) *
        100,
    );

  return `${String(
    minutes,
  ).padStart(
    2,
    "0",
  )}:${String(
    wholeSeconds,
  ).padStart(
    2,
    "0",
  )}.${String(
    milliseconds,
  ).padStart(
    2,
    "0",
  )}`;
}
