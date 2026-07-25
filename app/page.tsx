"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { createClient } from "@/lib/supabase/client";

export default function GatePage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Unlock animation
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
    // Gate entrance animation
    gsap.from(".gate-img", {
      opacity: 0,
      scale: 1.1,
      y: 40,
      duration: 2,
      ease: "power3.out",
    });

    // Breathing motion
    gsap.to(".gate-img", {
      scale: 1.03,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Fire flicker
    gsap.to(".fire-barrel", {
      opacity: 0.3,
      scale: 1.1,
      filter: "brightness(1.5)",
      duration: 0.4,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.15,
    });

    // Chains swinging
    gsap.to(".chain", {
      rotation: 10,
      transformOrigin: "top center",
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
    });
  }, []);

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("sending");
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://rapyard.club/profile",
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    setStatus("sent");
    unlockGate();

    // Redirect after unlock animation
    setTimeout(() => {
      window.location.href = "/profile";
    }, 1800);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">

      {/* White flash layer */}
      <div className="gate-flash pointer-events-none absolute inset-0 bg-white opacity-0"></div>

      {/* Chains */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 flex justify-between px-24 pt-6 z-20">
        <div className="chain h-40 w-1 bg-neutral-700/80" />
        <div className="chain h-52 w-1 bg-neutral-700/80" />
        <div className="chain h-44 w-1 bg-neutral-700/80" />
      </div>

      {/* Fire barrels */}
      <div className="pointer-events-none absolute bottom-10 left-16 h-32 w-32 rounded-full bg-orange-500/40 blur-xl fire-barrel" />
      <div className="pointer-events-none absolute bottom-10 right-16 h-32 w-32 rounded-full bg-red-500/40 blur-xl fire-barrel" />

      {/* Gate hero image */}
      <div className="relative w-full max-w-6xl mx-auto pt-20">
        <img
          src="/Gate.jpg"
          alt="Gate"
          className="gate-img w-full object-cover rounded-xl shadow-[0_0_60px_rgba(255,0,0,0.4)]"
        />

        {/* Email block overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-[8%]">
          <form
            onSubmit={sendMagicLink}
            className="email-block bg-black/70 backdrop-blur-md border border-red-700/40 px-4 py-3 rounded-lg w-[60%] max-w-md"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-black/60 border border-neutral-700 px-3 py-2 text-white text-sm outline-none focus:border-red-500"
              placeholder="Enter your email"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-3 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-md uppercase tracking-wide"
            >
              {status === "sending" ? "Sending Magic Link..." : "Send Magic Link"}
            </button>

            <div className="mt-2 text-xs text-center text-red-400">
              {status === "error" && errorMessage}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
