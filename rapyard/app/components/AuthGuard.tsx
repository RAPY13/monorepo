"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authCookie = document.cookie.split("; ").find((cookie) => cookie.trim().startsWith("rapyard-auth="));
    if (!authCookie) {
      router.replace("/gate");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="rounded-3xl border border-white/10 bg-black/70 px-8 py-6 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">Checking access</p>
          <p className="mt-4 text-lg font-semibold">Verifying your RapYard credentials…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
