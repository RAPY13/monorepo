"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import GateBackground from "@/components/gate/GateBackground";
import GateAtmosphere from "@/components/gate/GateAtmosphere";
import GateDoors from "@/components/gate/GateDoors";
import GateTitle from "@/components/gate/GateTitle";
import GateEnterButton from "@/components/gate/GateEnterButton";

type GateProps = {
  user: {
    email?: string;
  };
};

export default function Gate({ user }: GateProps) {
  const router = useRouter();
  const gateRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!gateRef.current) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .from("[data-gate='background']", {
          opacity: 0,
          duration: 0.6,
        })
        .from(
          "[data-gate='atmosphere']",
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          "[data-gate='title']",
          {
            opacity: 0,
            y: 24,
            duration: 0.5,
          },
          "-=0.2"
        )
        .from(
          "[data-gate='button']",
          {
            opacity: 0,
            y: 18,
            duration: 0.45,
          },
          "-=0.2"
        );
    }, gateRef);

    return () => ctx.revert();
  }, []);

  function handleEnter() {
    gsap.timeline({
      onComplete: () => router.push("/rap-sheet"),
    })
      .to("[data-gate='doors']", {
        scaleX: 0.98,
        duration: 0.15,
      })
      .to(
        "[data-gate='doors-left']",
        {
          xPercent: -100,
          duration: 1.3,
          ease: "power4.inOut",
        },
        0
      )
      .to(
        "[data-gate='doors-right']",
        {
          xPercent: 100,
          duration: 1.3,
          ease: "power4.inOut",
        },
        0
      )
      .to(
        gateRef.current,
        {
          scale: 1.05,
          duration: 1.3,
          ease: "power2.inOut",
        },
        0
      );
  }

  return (
    <section
      ref={gateRef}
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      <GateBackground />

      <GateAtmosphere />

      <GateDoors />

      <div className="relative z-20 flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-2xl text-center">
          <GateTitle user={user} />

          <div className="mt-12">
            <GateEnterButton onEnter={handleEnter} />
          </div>
        </div>
      </div>
    </section>
  );
}