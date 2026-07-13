"use client";

import { useGsap } from "@/lib/useGsap";
import gsap from "gsap";
import { useRef } from "react";

export default function GatePage() {
  const leftGate = useRef(null);
  const rightGate = useRef(null);
  const logo = useRef(null);

  useGsap(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    tl.fromTo(
      leftGate.current,
      { x: "-50%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.2 }
    )
      .fromTo(
        rightGate.current,
        { x: "50%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2 },
        "<"
      )
      .fromTo(
        logo.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4 },
        "-0.4"
      )
      .to(logo.current, {
        scale: 1.05,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      <div
        ref={leftGate}
        className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-black to-transparent"
      />
      <div
        ref={rightGate}
        className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-black to-transparent"
      />

      <div
        ref={logo}
        className="text-white text-6xl font-bold tracking-widest z-10"
      >
        RAPYARD
      </div>
    </div>
  );
}
