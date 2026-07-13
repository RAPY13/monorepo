"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ensureProfileRow } from "@/lib/onboarding-profile";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type");
      const nextPath = params.get("next") || "/onboarding";

      if (!tokenHash || type !== "email") {
        router.replace("/");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      });

      if (cancelled) {
        return;
      }

      const user = data.user;

      if (error || !user) {
        router.replace("/?openModal=1");
        return;
      }

      document.cookie = "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";

      const ensured = await ensureProfileRow(supabase, user);
      if (ensured.error) {
        setMessage("Email confirmed. Preparing your profile...");
      }

      if (cancelled) {
        return;
      }

      setMessage("Email confirmed. Opening your next screen...");
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
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Email confirmation</p>
        <p className="mt-4 text-xl font-semibold">{message}</p>
      </div>
    </main>
  );
}