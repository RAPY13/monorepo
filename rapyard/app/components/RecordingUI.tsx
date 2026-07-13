"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface RecordingUIProps {
    onRecordingComplete?: (audioBlob: Blob) => void;
}

export const RecordingUI: React.FC<RecordingUIProps> = ({ onRecordingComplete }) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationIdRef = useRef<number | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedRecordings, setSavedRecordings] = useState<
        { id: string; name: string; duration: number; timestamp: number }[]
    >([]);

    // Initialize audio recording
    const initializeAudio = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            analyserRef.current = analyser;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
                chunksRef.current = [];

                // Save to local storage
                const recordingId = `rec_${Date.now()}`;
                const newRecording = {
                    id: recordingId,
                    name: `Recording ${new Date().toLocaleTimeString()}`,
                    duration: recordingTime,
                    timestamp: Date.now(),
                };

                setSavedRecordings((prev) => [newRecording, ...prev]);
                onRecordingComplete?.(audioBlob);
            };

            setPermissionGranted(true);
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : "Failed to access microphone";
            setError(errorMsg);
            console.error("Microphone access denied:", err);
        }
    };

    // Start recording
    const startRecording = async () => {
        if (!permissionGranted) {
            await initializeAudio();
        }

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "inactive") {
            chunksRef.current = [];
            setRecordingTime(0);
            mediaRecorderRef.current.start();
            setIsRecording(true);

            // Draw waveform
            drawWaveform();
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        }
    };

    // Draw waveform visualization
    const drawWaveform = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const analyser = analyserRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const draw = () => {
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = "rgb(250, 204, 21)"; // yellow-400
            ctx.lineWidth = 2;
            ctx.beginPath();

            const sliceWidth = (canvas.width * 1.0) / dataArray.length;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            if (isRecording) {
                animationIdRef.current = requestAnimationFrame(draw);
            }
        };

        draw();
    };

    // Update recording time
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRecording]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-8">
            {/* Waveform Visualization */}
            <div className="border border-yellow-500/30 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={120}
                    className="w-full"
                    style={{ display: "block" }}
                />
            </div>

            {/* Recording Controls */}
            <div className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-900/30 border border-red-600 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Timer */}
                <div className="text-center">
                    <p className="text-3xl font-black text-yellow-400">
                        {formatTime(recordingTime)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {isRecording ? "RECORDING..." : "Ready"}
                    </p>
                </div>

                {/* Record/Stop Button */}
                <div className="flex gap-4">
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="flex-1 py-6 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-black tracking-wider transition-colors shadow-lg shadow-red-600/50"
                        >
                            ● START RECORDING
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex-1 py-6 bg-red-600 hover:bg-red-700 rounded-lg text-xl font-black tracking-wider transition-colors shadow-lg shadow-red-600/50 animate-pulse"
                        >
                            ⏹ STOP RECORDING
                        </button>
                    )}
                </div>
            </div>

            {/* Saved Recordings List */}
            {savedRecordings.length > 0 && (
                <div className="border-t border-gray-800 pt-6 space-y-3">
                    <h3 className="text-sm font-bold text-yellow-400 tracking-[0.2em]">
                        RECENT TAKES
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {savedRecordings.map((rec) => (
                            <div
                                key={rec.id}
                                className="p-3 bg-black/40 border border-gray-700 rounded text-sm flex justify-between items-center hover:border-yellow-500/50 transition-colors"
                            >
                                <div>
                                    <p className="text-gray-200">{rec.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatTime(rec.duration)} • {new Date(rec.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                                <button className="text-xs font-bold text-yellow-400 hover:text-yellow-300">
                                    ▶
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
