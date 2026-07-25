"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import ProgressBar from "./ProgressBar";

type WaitlistStats = {
  foundersClaimed: number;
  foundersLimit: number;
  foundersRemaining: number;
  progress: number;
};

const EMPTY_STATS: WaitlistStats = {
  foundersClaimed: 0,
  foundersLimit: 500,
  foundersRemaining: 500,
  progress: 0,
};

export default function FounderCounter() {
  const [stats, setStats] = useState<WaitlistStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch("/api/waitlist", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        return;
      }

      const next = (await res.json()) as WaitlistStats;
      setStats({
        foundersClaimed: Number(next.foundersClaimed ?? 0),
        foundersLimit: Number(next.foundersLimit ?? 500),
        foundersRemaining: Number(next.foundersRemaining ?? 500),
        progress: Number(next.progress ?? 0),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshStats();

    const intervalId = window.setInterval(() => {
      void refreshStats();
    }, 15000);

    const handleWaitlistUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<Partial<WaitlistStats>>;
      const detail = customEvent.detail;

      if (!detail) {
        void refreshStats();
        return;
      }

      setStats((current) => ({
        foundersClaimed: Number(detail.foundersClaimed ?? current.foundersClaimed),
        foundersLimit: Number(detail.foundersLimit ?? current.foundersLimit),
        foundersRemaining: Number(detail.foundersRemaining ?? current.foundersRemaining),
        progress: Number(detail.progress ?? current.progress),
      }));
    };

    window.addEventListener("waitlist:updated", handleWaitlistUpdated as EventListener);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("waitlist:updated", handleWaitlistUpdated as EventListener);
    };
  }, [refreshStats]);

  const counter = useMemo(() => {
    if (loading) {
      return "... / 500";
    }

    return `${stats.foundersClaimed} / ${stats.foundersLimit}`;
  }, [loading, stats.foundersClaimed, stats.foundersLimit]);

  return (
    <div className="mx-auto mt-20 w-full max-w-3xl text-center">
      <p className="text-[clamp(2.6rem,5.4vw,3rem)] font-black leading-[1.1] tracking-tight text-[#d4af37]">{counter}</p>

      <div className="mt-8">
        <ProgressBar value={stats.progress} />
      </div>

      <p className="mt-10 text-[clamp(2rem,4.5vw,2.5rem)] font-semibold uppercase leading-[1.15] tracking-[0.12em] text-zinc-200">
        {stats.foundersRemaining} Founder Badges Remaining
      </p>
    </div>
  );
}
