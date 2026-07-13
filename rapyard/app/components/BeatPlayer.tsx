"use client";

import React, { useEffect, useRef, useState } from "react";

interface BeatPlayerProps {
    beatId: string;
    beatName: string;
    audioUrl: string;
    bpm: number;
}

export const BeatPlayer: React.FC<BeatPlayerProps> = ({
    beatId,
    beatName,
    audioUrl,
    bpm,
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isLoading, setIsLoading] = useState(false);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            setIsLoading(true);
            audioRef.current.play().catch((err) => {
                console.error("Error playing audio:", err);
                setIsLoading(false);
            });
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoading(false);
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        setIsLoading(false);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-3">
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                crossOrigin="anonymous"
            />

            {/* Player Controls */}
            <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm space-y-3">
                {/* Play/Pause + Info */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={togglePlayPause}
                        disabled={isLoading}
                        className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center font-bold transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-transparent border-t-black rounded-full animate-spin" />
                        ) : isPlaying ? (
                            "⏸"
                        ) : (
                            "▶"
                        )}
                    </button>

                    {/* Time Display */}
                    <div className="text-sm text-gray-400">
                        <span className="text-yellow-400">{formatTime(currentTime)}</span>
                        <span className="mx-2">/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-1 bg-gray-700 rounded-full cursor-pointer appearance-none accent-yellow-500"
                    />
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 h-1 bg-gray-700 rounded-full cursor-pointer appearance-none accent-yellow-500"
                    />
                    <span className="text-xs text-gray-500 w-6 text-right">{volume}%</span>
                </div>
            </div>
        </div>
    );
};
