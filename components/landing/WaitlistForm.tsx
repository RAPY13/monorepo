"use client";

import { FormEvent, useState } from "react";

type AccountResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  founderNumber?: number | null;
  alreadyJoined?: boolean;
  foundersClaimed?: number;
  foundersLimit?: number;
  foundersRemaining?: number;
  progress?: number;
};

export default function AccountForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<AccountResponse | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter your email to claim your Founder Badge.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/Account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await response.json().catch(() => ({}))) as AccountResponse;

      if (!response.ok) {
        setSuccess(null);
        setError(data.error ?? data.message ?? "Unable to Create Your Account.");
        return;
      }

      setSuccess(data);
      setEmail("");

      window.dispatchEvent(
        new CustomEvent("Account:updated", {
          detail: {
            foundersClaimed: data.foundersClaimed,
            foundersLimit: data.foundersLimit,
            foundersRemaining: data.foundersRemaining,
            progress: data.progress,
          },
        })
      );
    } catch {
      setSuccess(null);
      setError("Network issue while reserving your Founder Badge. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-[64rem]">
      <form onSubmit={submit} className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="min-h-[3.8rem] flex-1 border-[3px] border-[#c0c0c0]/55 bg-[#0a0a0a] px-6 py-3 text-[1.22rem] leading-[1.25] text-zinc-100 outline-none transition focus:border-[#d4af37]"
        />

        <button
          type="submit"
          disabled={loading}
          className="min-h-[3.8rem] shrink-0 border-[3px] border-[#d4af37] bg-[#111111] px-10 py-3 text-[clamp(1.15rem,1.8vw,1.35rem)] font-bold uppercase leading-[1.2] tracking-[0.05em] text-[#d4af37] transition hover:border-[#c0c0c0] hover:text-[#c0c0c0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Claiming..." : "⚔ Claim My Founder Badge"}
        </button>
      </form>

      {error ? (
        <p className="mt-5 text-lg text-red-400">{error}</p>
      ) : null}

      {success ? (
        <div className="mt-8 border border-[#d4af37]/35 bg-zinc-950/90 p-7 text-left text-zinc-100">
          <p className="text-2xl font-bold text-[#d4af37]">
            {success.alreadyJoined ? "🔥 Welcome back, Founder." : "🔥 Welcome, Founder."}
          </p>
          <p className="mt-3 text-xl text-zinc-300">Your Founder Badge has been reserved.</p>
          {success.founderNumber ? (
            <p className="mt-3 text-xl text-zinc-100">Founder #{success.founderNumber}</p>
          ) : null}
          <p className="mt-3 text-xl text-zinc-300">We&apos;ll notify you when the gates open.</p>
          <p className="mt-3 text-xl text-zinc-300">Claim your place before the gates close.</p>
        </div>
      ) : null}
    </div>
  );
}
