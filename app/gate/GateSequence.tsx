"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";

export default function GatePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const unlockGate = () => {
    const tl = gsap.timeline();

    tl.to(".gate-img", {
      y: -10,
      duration: 0.2,
      ease: "power2.inOut",
    })
      .to(".gate-img", {
        y: 0,
        duration: 0.2,
        ease: "power2.inOut",
      })
      .to(".chain", {
        rotation: 25,
        duration: 0.4,
        ease: "power4.out",
        stagger: 0.1,
      })
      .to(".fire-barrel", {
        scale: 1.4,
        opacity: 0.8,
        filter: "brightness(2)",
        duration: 0.3,
        ease: "power3.out",
      })
      .to(".gate-img", {
        scale: 1.4,
        opacity: 0,
        duration: 1.6,
        ease: "power4.inOut",
      })
      .to(".gate-flash", {
        opacity: 1,
        duration: 0.3,
        ease: "power4.out",
      })
      .to(".gate-flash", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
  };

  useEffect(() => {
    gsap.from(".gate-img", {
      opacity: 0,
      scale: 1.1,
      y: 40,
      duration: 2,
      ease: "power3.out",
    });

    gsap.to(".gate-img", {
      scale: 1.03,
      duration: 6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(".fire-barrel", {
      opacity: 0.3,
      scale: 1.1,
      filter: "brightness(1.5)",
      duration: 0.4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.15,
    });

    gsap.to(".chain", {
      rotation: 10,
      transformOrigin: "top center",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2,
    });
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("sending");
    setErrorMessage(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    unlockGate();
    setStatus("sent");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <div className="gate-flash pointer-events-none absolute inset-0 bg-white opacity-0" />

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex justify-between px-24 pt-6">
        <div className="chain h-40 w-1 bg-neutral-700/80" />
        <div className="chain h-52 w-1 bg-neutral-700/80" />
        <div className="chain h-44 w-1 bg-neutral-700/80" />
      </div>

      <div className="fire-barrel pointer-events-none absolute bottom-10 left-16 h-32 w-32 rounded-full bg-orange-500/40 blur-xl" />
      <div className="fire-barrel pointer-events-none absolute bottom-10 right-16 h-32 w-32 rounded-full bg-red-500/40 blur-xl" />

      <div className="relative mx-auto w-full max-w-6xl pt-20">

        <img
          src="/Gate.jpg"
          alt="Gate"
          className="gate-img pointer-events-none w-full rounded-xl object-cover shadow-[0_0_60px_rgba(255,0,0,0.4)]"
        />

        <div className="absolute inset-0 z-30 flex items-end justify-center pb-[8%]">

          <form
            onSubmit={sendMagicLink}
            className="relative z-40 w-[60%] max-w-md rounded-xl border border-red-700/40 bg-black/70 px-5 py-4 backdrop-blur-xl"
          >

            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-black/60 px-4 py-3 text-white outline-none transition focus:border-red-500"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-4 w-full rounded-md bg-red-600 py-3 font-bold uppercase tracking-wider transition hover:bg-red-500 disabled:opacity-60"
            >
              {status === "sending"
                ? "Sending Magic Link..."
                : "Enter The Yard"}
            </button>

            {status === "sent" && (
              <div className="mt-5 text-center">
                <p className="font-semibold text-green-400">
                  Check your email.
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Your Magic Link is on its way.
                  <br />
                  Click it to enter RapYard.
                </p>
              </div>
            )}

            {status === "error" && (
              <p className="mt-4 text-center text-sm text-red-400">
                {errorMessage}
              </p>
            )}

          </form>

        </div>

      </div>
    </main>
  );
}