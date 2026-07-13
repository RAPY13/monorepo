"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_COOLDOWN_KEY = "rapyard-otp-cooldown-until";

function normalizeLoginErrorMessage(value: string) {
  if (value.trim() === "{}") {
    return "Email delivery is not configured yet. Please finish Supabase SMTP settings and try again.";
  }

  return value;
}

export default function Landing() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    function getRemainingSeconds() {
      const rawValue = window.localStorage.getItem(OTP_COOLDOWN_KEY);
      const cooldownUntil = rawValue ? Number(rawValue) : 0;

      if (!Number.isFinite(cooldownUntil) || cooldownUntil <= Date.now()) {
        return 0;
      }

      return Math.ceil((cooldownUntil - Date.now()) / 1000);
    }

    setCooldownSeconds(getRemainingSeconds());

    const interval = window.setInterval(() => {
      setCooldownSeconds(getRemainingSeconds());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  function startCooldown(seconds = OTP_RESEND_COOLDOWN_SECONDS) {
    const cooldownUntil = Date.now() + seconds * 1000;
    window.localStorage.setItem(OTP_COOLDOWN_KEY, String(cooldownUntil));
    setCooldownSeconds(seconds);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter your email to unlock the gate.");
      setStatus(null);
      return;
    }

    if (cooldownSeconds > 0) {
      setError(`Please wait ${cooldownSeconds}s before requesting another login email.`);
      setStatus(null);
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/auth/email-login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          next: "/role",
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        retryAfter?: number;
      };

      if (!response.ok) {
        const message = normalizeLoginErrorMessage(data.error || "Could not send login email. Try again in a moment.");
        const retryAfter = typeof data.retryAfter === "number" ? data.retryAfter : OTP_RESEND_COOLDOWN_SECONDS;

        if (response.status === 429) {
          startCooldown(retryAfter);
        }

        throw new Error(message);
      }

      setStatus("Check your email for your login link.");
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : "Could not send login email. Try again in a moment.";
      const normalizedMessage = normalizeLoginErrorMessage(rawMessage);
      const isRateLimited = /rate limit|too many requests|over_email_send_rate_limit/i.test(normalizedMessage);

      const message = isRateLimited
        ? "Email rate limit reached. Please wait 60 seconds, then try again."
        : normalizedMessage;

      if (isRateLimited) {
        startCooldown();
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060606] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.12),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:repeating-linear-gradient(90deg,transparent_0,transparent_20px,rgba(255,255,255,0.06)_20px,rgba(255,255,255,0.06)_21px)]" />

      <div className="relative w-full max-w-xl rounded-[1.75rem] border border-[#7a5828] bg-[#0b0b0b]/90 p-6 shadow-[0_0_48px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-8">
        <Image
          src="/images/logo/logo.png"
          alt="RapYard Logo"
          width={160}
          height={160}
          className="mb-8 mx-auto"
          priority
        />

        <div className="text-lg md:text-xl text-zinc-300 leading-relaxed mb-8">
          <p>Creators Build the Yard.</p>
          <p>Listeners Move the Yard.</p>
          <p>Together,</p>
          <p>We Own the Yard.</p>
        </div>

        <form onSubmit={submit} className="w-full max-w-sm mx-auto">
          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-[#d4af37]">Enter Your Email</p>
          <input
            type="email"
            placeholder="you@rapyard.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 w-full rounded-lg bg-[#090909] border border-[#6e4f26] text-white outline-none transition focus:border-[#d4af37] focus:shadow-[0_0_0_1px_rgba(212,175,55,0.45)]"
          />

          <button
            type="submit"
            disabled={loading || cooldownSeconds > 0}
            className="mt-5 w-full px-8 py-3 border border-[#d4af37] rounded-lg text-sm font-black tracking-[0.24em] uppercase text-black bg-gradient-to-b from-[#f3bf6d] to-[#aa6b1f] transition hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING LINK" : cooldownSeconds > 0 ? `WAIT ${cooldownSeconds}s` : "EMAIL LOGIN"}
          </button>
        </form>

        {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <p className="mt-6 text-xs uppercase tracking-[0.22em] text-zinc-500">Founders receive a permanent badge.</p>
      </div>
    </main>
  );
}
