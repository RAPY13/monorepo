"use client";

import { useCallback } from "react";
import { gsap } from "gsap";

export function useSceneTransition() {
  const transition = useCallback((type: string) => {
    switch (type) {
      case "landing-to-founder":
        gsap.fromTo(
          ".scene",
          { opacity: 1, filter: "blur(0px)" },
          {
            opacity: 0,
            filter: "blur(20px)",
            duration: 0.6,
            ease: "power3.inOut"
          }
        );
        break;

      case "founder-to-lane":
        gsap.fromTo(
          ".scene",
          { opacity: 1, x: 0 },
          {
            opacity: 0,
            x: -200,
            duration: 0.5,
            ease: "power2.inOut"
          }
        );
        break;

      case "lane-to-booth":
        gsap.fromTo(
          ".scene",
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 1.2,
            duration: 0.7,
            ease: "expo.inOut"
          }
        );
        break;

      case "booth-to-yard":
        gsap.fromTo(
          ".scene",
          { opacity: 1, filter: "brightness(1)" },
          {
            opacity: 0,
            filter: "brightness(3)",
            duration: 0.8,
            ease: "power4.inOut"
          }
        );
        break;
    }
  }, []);

  return { transition };
}
