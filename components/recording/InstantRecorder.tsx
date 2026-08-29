"use client";

import { useEffect, useRef, useState } from "react";
import { Mic2, Play, Square, Trash2 } from "lucide-react";

type SavedRecording = {
  id: string;
  title: string;
  createdAt: string;
  duration: number;
  dataUrl: string;
};

const STORAGE_KEY = "rapyard.instant-recordings";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function readSavedRecordings() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as SavedRecording[]) : [];
  } catch {
    return [];
  }
}

export default function InstantRecorder() {
  const [recording, setRecording] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [waveform, setWaveform] = useState<number[]>(() => Array(48).fill(0.08));
  const [savedRecordings, setSavedRecordings] = useState<SavedRecording[]>([]);
  const [error, setError] = useState("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    setSavedRecordings(readSavedRecordings());
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  function startTimer() {
    timerRef.current = setInterval(() => {
      if (startedAtRef.current !== null) {
        setDuration((Date.now() - startedAtRef.current) / 1000);
      }
    }, 250);
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  async function startRecording() {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone recording is not supported in this browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      streamRef.current = stream;
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (!blob.size) {
          setError("The recording was empty.");
          return;
        }
        setPendingBlob(blob);
        setAudioUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start(100);
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 128;
        source.connect(analyser);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        updateWaveform();
      }
      startedAtRef.current = Date.now();
      setDuration(0);
      startTimer();
      setRecording(true);
    } catch (recordingError) {
      setError(recordingError instanceof Error ? recordingError.message : "Microphone access was denied.");
    }
  }

  function stopRecording() {
    if (!recorderRef.current || recorderRef.current.state === "inactive") return;
    recorderRef.current.stop();
    stopTimer();
    stopWaveform();
    setRecording(false);
    if (startedAtRef.current !== null) setDuration((Date.now() - startedAtRef.current) / 1000);
    startedAtRef.current = null;
  }

  function resetTake() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setPendingBlob(null);
    setDuration(0);
    setWaveform(Array(48).fill(0.08));
    setError("");
  }

  function updateWaveform() {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const samples = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(samples);
    const bars = Array.from({ length: 48 }, (_, index) => {
      const start = Math.floor((index / 48) * samples.length);
      const end = Math.max(start + 1, Math.floor(((index + 1) / 48) * samples.length));
      let peak = 0;
      for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
        peak = Math.max(peak, Math.abs(samples[sampleIndex] - 128) / 128);
      }
      return Math.max(0.08, Math.min(1, peak * 2.8));
    });
    setWaveform(bars);
    animationRef.current = requestAnimationFrame(updateWaveform);
  }

  function stopWaveform() {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    analyserRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
  }

  async function saveRecording() {
    if (!pendingBlob) return;
    setSaving(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to save recording."));
        reader.readAsDataURL(pendingBlob);
      });
      const next: SavedRecording = {
        id: crypto.randomUUID(),
        title: `Instant Take ${savedRecordings.length + 1}`,
        createdAt: new Date().toISOString(),
        duration,
        dataUrl,
      };
      const recordings = [next, ...readSavedRecordings()];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
      setSavedRecordings(recordings);
      resetTake();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save recording.");
    } finally {
      setSaving(false);
    }
  }

  function deleteRecording(id: string) {
    const recordings = savedRecordings.filter((recording) => recording.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
    setSavedRecordings(recordings);
  }

  function deleteEverything() {
    window.localStorage.removeItem(STORAGE_KEY);
    setSavedRecordings([]);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-500">Instant Recording</p>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-tight md:text-7xl">Lay It Down.</h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">Record a take immediately. Save it here for playback, or clear the whole room.</p>

        <section className="mt-10 border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Mic Status</p>
              <p className="mt-2 text-2xl font-black uppercase text-orange-400">{recording ? "Recording" : pendingBlob ? "Take Ready" : "Ready"}</p>
              <p className="mt-2 text-sm text-zinc-600">{formatDuration(duration)}</p>
            </div>
            <button type="button" onClick={recording ? stopRecording : startRecording} className="flex items-center justify-center gap-3 border border-orange-500 bg-orange-500 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-orange-400">
              {recording ? <Square className="h-4 w-4" /> : <Mic2 className="h-4 w-4" />}
              {recording ? "Stop Recording" : "Record Now"}
            </button>
          </div>
          <div className="mt-8 flex h-24 items-center gap-1 border-y border-zinc-900 bg-black px-4" aria-label="Recording waveform">
            {waveform.map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-full bg-orange-500/80 transition-[height] duration-75"
                style={{ height: `${Math.max(8, height * 88)}%` }}
              />
            ))}
          </div>
          {audioUrl ? (
            <div className="mt-8 flex flex-col gap-4 border-t border-zinc-900 pt-6 sm:flex-row sm:items-center">
              <audio controls src={audioUrl} className="min-w-0 flex-1" />
              <button type="button" onClick={() => void saveRecording()} disabled={saving} className="border border-zinc-700 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white hover:border-orange-500 disabled:opacity-50">{saving ? "Saving" : "Save Take"}</button>
              <button type="button" onClick={resetTake} className="border border-zinc-800 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white">Delete Take</button>
            </div>
          ) : null}
          {error ? <p role="alert" className="mt-5 border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</p> : null}
        </section>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">Saved Takes</p>
              <p className="mt-2 text-sm text-zinc-500">{savedRecordings.length} recording{savedRecordings.length === 1 ? "" : "s"}</p>
            </div>
            {savedRecordings.length ? <button type="button" onClick={deleteEverything} className="flex items-center gap-2 border border-red-900/60 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-red-400 hover:bg-red-950/40"><Trash2 className="h-3.5 w-3.5" /> Delete Everything</button> : null}
          </div>
          <div className="mt-6 space-y-3">
            {savedRecordings.map((recording) => (
              <div key={recording.id} className="flex flex-col gap-4 border border-zinc-900 bg-black p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black uppercase text-zinc-200">{recording.title}</p>
                  <p className="mt-1 text-xs text-zinc-600">{formatDuration(recording.duration)} · {new Date(recording.createdAt).toLocaleString()}</p>
                </div>
                <audio controls src={recording.dataUrl} className="w-full sm:w-64" />
                <button type="button" onClick={() => deleteRecording(recording.id)} aria-label={`Delete ${recording.title}`} className="flex items-center justify-center border border-zinc-800 p-3 text-zinc-500 hover:border-red-900/60 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                <Play className="hidden h-4 w-4 text-zinc-700 sm:block" aria-hidden="true" />
              </div>
            ))}
            {!savedRecordings.length ? <p className="py-8 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-700">No saved takes yet</p> : null}
          </div>
        </section>
      </div>
    </main>
  );
}
