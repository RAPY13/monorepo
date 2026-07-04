"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const router = useRouter();
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    const authCookie = document.cookie.split("; ").find((cookie) => cookie.trim().startsWith("rapyard-auth="));
    const signedIn = Boolean(authCookie);
    setHasAuth(signedIn);

    if (signedIn) {
      const timer = window.setTimeout(() => router.replace("/feed"), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-black/70 p-12 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/90 mb-4">Founders only</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
          {hasAuth ? "Your Yard awaits." : "The gate is still closed."}
        </h1>
        <p className="text-base text-zinc-300 max-w-2xl mx-auto">
          {hasAuth
            ? "Your access token is live. Redirecting into Week 1 soon."
            : "You need to get through the Gate first. Submit your email on the main page to claim your Founder slot."}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.replace(hasAuth ? "/feed" : "/?openModal=1")}
            className="rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-yellow-300"
          >
            {hasAuth ? "Enter the Feed" : "Return to Gate"}
          </button>
          {hasAuth ? null : (
            <button
              type="button"
              onClick={() => router.replace("/?openModal=1")}
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
            >
              Start the Gate
            </button>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-left text-sm text-white/80 sm:text-base">
          <p className="font-semibold uppercase tracking-[0.25em] text-yellow-300 mb-2">Email block</p>
          <p>Use your email to join the WAITLIST and get the Founders badge.</p>
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/40">
          {hasAuth ? "Redirecting in a moment…" : "No auth found. Gate access is required."}
        </p>
      </div>
    </main>
  );
}
