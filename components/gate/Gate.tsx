"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import GateBackground from "@/components/gate/GateBackground";
import GateEnterButton from "@/components/gate/GateEnterButton";

type GateProps = {
  user: {
    email?: string;
  };
};

export default function Gate({ user }: GateProps) {
  const router = useRouter();

  const gateRef = useRef<HTMLElement | null>(null);
  const [entering, setEntering] = useState(false);

  useLayoutEffect(() => {
    if (!gateRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-gate='closed-gate']", {
        opacity: 1,
        scale: 1,
      });

      gsap.set("[data-gate='background']", {
        scale: 1,
      });

      gsap.set("[data-gate='title']", {
        opacity: 1,
        y: 0,
      });

      gsap.set("[data-gate='button']", {
        opacity: 1,
        y: 0,
      });
    }, gateRef);

    return () => ctx.revert();
  }, []);

  function handleEnter() {
    if (entering || !gateRef.current) return;

    setEntering(true);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.inOut",
        },
        onComplete: () => {
          router.push("/rap-sheet");
        },
      });

      timeline
        // Button press
        .to("[data-gate='button']", {
          scale: 0.94,
          duration: 0.12,
          ease: "power2.out",
        })

        // Begin moving toward the Yard
        .to(
          "[data-gate='background']",
          {
            scale: 1.08,
            duration: 2,
          },
          0.1,
        )

        // Pull the closed gate away
        .to(
          "[data-gate='closed-gate']",
          {
            scale: 1.12,
            opacity: 0,
            duration: 1.7,
            ease: "power4.inOut",
          },
          0.15,
        )

        // Remove title
        .to(
          "[data-gate='title']",
          {
            opacity: 0,
            y: -35,
            duration: 0.7,
            ease: "power3.in",
          },
          0.2,
        )

        // Remove button
        .to(
          "[data-gate='button']",
          {
            opacity: 0,
            y: 30,
            duration: 0.5,
          },
          0.2,
        );
    }, gateRef);

    return () => ctx.revert();
  }

  return (
    <main
      ref={gateRef}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Yard + closed RapYard gate */}
      <GateBackground />

      {/* Cinematic vignette */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-40
          bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,.65)_100%)]
        "
      />

      {/* Gate content */}
      <div className="relative z-50 flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          <div data-gate="title">
            <p className="text-xs font-black uppercase tracking-[0.55em] text-orange-400">
              The Yardgate Awakens
            </p>

            <h1
              className="
                mt-5
                text-5xl
                font-black
                uppercase
                tracking-[0.08em]
                text-white
                drop-shadow-[0_4px_20px_rgba(0,0,0,.9)]
                md:text-7xl
              "
            >
              Enter The Yard
            </h1>

            <p className="mt-5 max-w-xl text-sm text-zinc-300/80 md:text-base">
              The gate is waiting.
            </p>

            {user.email && (
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-zinc-500">
                Gate pass verified
              </p>
            )}
          </div>

          <div
            data-gate="button"
            className="mt-10"
          >
            <GateEnterButton
              onClick={handleEnter}
              disabled={entering}
            />
          </div>
        </div>
      </div>
    </main>
  );
}