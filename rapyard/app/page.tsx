"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams?.get("email") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function enterYard(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      document.cookie = "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";
      router.push("/gate");
      return;
    }

    const data = await res.json().catch(() => null);
    setError(data?.message || "Unable to enter the yard. Try again.");
  }

  return (
    <main
      className="min-h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: "url('/gate-bg.webp')" }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        <img src="/logo.png" alt="RapYard" className="w-40 mb-10 opacity-90" />

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-300/90 mb-4">
            THE MYTHIC GATE
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Enter the Forge. Claim your Founding Flame.
          </h1>
          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto mb-10">
            Join the first wave of RapYard founders and lock in your permanent badge. The gate opens only for the earliest spark.
          </p>
        </div>

        <form onSubmit={enterYard} className="w-full max-w-xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_210px]">
            <input
              type="email"
              required
              placeholder="rapyard.app@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Entering..." : "⚔ ENTER THE YARD"}
            </button>
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/80 sm:text-base">
            <p className="font-semibold uppercase tracking-[0.25em] text-yellow-300 mb-2">Email block</p>
              <p>
                Use your email to join the WAITLIST and get the Founders badge.
              </p>
          </div>
        </form>

        <div className="mt-12 flex flex-col items-center gap-3">
          <img src="/founder-badge.svg" alt="Founder Badge" className="w-20" />
          <p className="text-sm text-white/70 max-w-xs">
            Founding members get the exclusive RapYard badge and first access to the private feed.
          </p>
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.35em] text-white/40">
          FOUNDERS JOINED: 07426
        </p>
      </div>
    </main>
  );
}
