"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ensureProfileRow } from "@/lib/onboarding-profile";

function AuthConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Confirming your email…");

  useEffect(() => {
    let cancelled = false;

    async function confirm() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      const supabase = createClient();

      if (!tokenHash || !type) {
        // No OTP params — check for an existing session (e.g. OAuth redirect)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (user) {
          document.cookie =
            "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";
          router.replace("/gate");
          return;
        }

        setMessage("Invalid confirmation link. Redirecting…");
        setTimeout(() => router.replace("/?openModal=1"), 2500);
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as Parameters<typeof supabase.auth.verifyOtp>[0]["type"],
      });

      if (cancelled) return;

      if (error) {
        console.error("[auth/confirm] verifyOtp failed", error.message);
        setMessage(
          "Confirmation failed or link expired. Please request a new login link."
        );
        setTimeout(() => router.replace("/?openModal=1"), 2500);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        setMessage("Session could not be established. Please try again.");
        setTimeout(() => router.replace("/?openModal=1"), 2000);
        return;
      }

      document.cookie =
        "rapyard-auth=1; path=/; max-age=31536000; samesite=lax";

      await ensureProfileRow(supabase, user);

      if (cancelled) return;

      setMessage("Email confirmed! Welcome to RapYard.");
      router.replace("/gate");
    }

    void confirm();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
          Email confirmation
        </p>
        <p className="mt-4 text-xl font-semibold">{message}</p>
      </div>
    </main>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-black/70 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">
              Email confirmation
            </p>
            <p className="mt-4 text-xl font-semibold">Confirming your email…</p>
          </div>
        </main>
      }
    >
      <AuthConfirmInner />
    </Suspense>
  );
}
