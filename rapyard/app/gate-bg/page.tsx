"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GateBgPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace("/gate");
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/rapyard-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-3xl border border-[#d4af37]/45 bg-black/65 p-8 text-center shadow-2xl shadow-black/60 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.36em] text-[#d4af37]">Gate Background</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] text-zinc-100 md:text-5xl">
            The Gate Is Open
          </h1>
          <p className="mt-6 text-lg text-zinc-200">Welcome to the Yard.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-zinc-300">Entering in 2 seconds...</p>

          <div className="mt-10">
            <Link
              href="/gate"
              className="inline-flex rounded-full border border-white/50 px-8 py-3 text-sm font-semibold uppercase tracking-[0.28em] transition hover:bg-white hover:text-black"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
