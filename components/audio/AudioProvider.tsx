"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AudioContext,
  type AudioRecording,
} from "./AudioContext";
type Props = {
  children: React.ReactNode;
};

export default function AudioProvider({
  children,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrack, setCurrentTrack] =
    useState<AudioRecording | null>(null);

  const [playing, setPlaying] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [duration, setDuration] =
    useState(0);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [volume, setVolumeState] =
    useState(1);

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "auto";
    audio.volume = 1;

    audioRef.current = audio;

    function onLoadedMetadata() {
      setDuration(audio.duration || 0);
    }

    function onTimeUpdate() {
      setCurrentTime(audio.currentTime);
    }

    function onPlay() {
      setPlaying(true);
    }

    function onPause() {
      setPlaying(false);
    }

    function onEnded() {
      setPlaying(false);
      setCurrentTime(0);
    }

    audio.addEventListener(
      "loadedmetadata",
      onLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      onTimeUpdate
    );

    audio.addEventListener(
      "play",
      onPlay
    );

    audio.addEventListener(
      "pause",
      onPause
    );

    audio.addEventListener(
      "ended",
      onEnded
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "loadedmetadata",
        onLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );

      audio.removeEventListener(
        "play",
        onPlay
      );

      audio.removeEventListener(
        "pause",
        onPause
      );

      audio.removeEventListener(
        "ended",
        onEnded
      );
    };
  }, []);

  async function play(
    recording: AudioRecording
  ) {
    if (!audioRef.current) return;

    try {
      setLoading(true);

      if (
        currentTrack?.id !== recording.id
      ) {
        audioRef.current.src = recording.url;
        setCurrentTrack(recording);
      }

      await audioRef.current.play();
    } finally {
      setLoading(false);
    }
  }

  function pause() {
    audioRef.current?.pause();
  }

  function resume() {
    audioRef.current?.play();
  }

  function stop() {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setCurrentTime(0);
  }

  function seek(seconds: number) {
    if (!audioRef.current) return;

    audioRef.current.currentTime =
      seconds;
  }

  function setVolume(value: number) {
    if (!audioRef.current) return;

    audioRef.current.volume = value;
    setVolumeState(value);
  }

  const value = useMemo(
    () => ({
      currentTrack,

      audio: audioRef.current,

      playing,

      loading,

      duration,

      currentTime,

      progress:
        duration === 0
          ? 0
          : (currentTime / duration) *
            100,

      volume,

      play,

      pause,

      resume,

      stop,

      seek,

      setVolume,
    }),
    [
      currentTrack,
      playing,
      loading,
      duration,
      currentTime,
      volume,
    ]
  );

  return (
    <AudioContext.Provider
      value={value}
    >
      {children}
    </AudioContext.Provider>
  );
}


