"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { ensureProfileRow, getOnboardingProfile } from "../../../lib/onboarding-profile";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your session...");
  const [debug, setDebug] = useState("payload=unknown");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (code) {
        setDebug("payload=code");
      } else if (tokenHash) {
        setDebug(`payload=token_hash&type=${type ?? "missing"}`);
      } else {
        setDebug("payload=none");
      }

      if (code) {
        setMessage("Completing sign-in from email link...");
        await supabase.auth.exchangeCodeForSession(code);
      } else if (tokenHash && type === "email") {
        setMessage("Verifying email token...");
        await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" });
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (error || !user) {
        setDebug((current) => `${current} | result=no-user`);
        router.replace("/?openModal=1");
        return;
      }

      setDebug((current) => `${current} | result=user-ok`);

      const nextPath = params.get("next") || "/onboarding";

      document.cookie = "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";

      const ensured = await ensureProfileRow(supabase, user);
      if (ensured.error) {
        setMessage("Session verified. Preparing your profile...");
      }

      const { profile } = await getOnboardingProfile(supabase, user);

      if (cancelled) {
        return;
      }

      if (!profile) {
        setMessage("Session ready. Opening the gate...");
        router.replace(nextPath);
        return;
      }

      setMessage("Session ready. Opening the gate...");
      router.replace(nextPath);
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Auth callback</p>
        <p className="mt-4 text-xl font-semibold">{message}</p>
        <p className="mt-3 text-xs text-zinc-500">{debug}</p>
      </div>
    </main>
  );
}
