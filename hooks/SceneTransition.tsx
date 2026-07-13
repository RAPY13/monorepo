"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export default function SceneTransition({ children }) {
  useEffect(() => {
    gsap.fromTo(
      ".scene",
      { opacity: 0, y: 40, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
      }
    );
  }, []);

  return <div className="scene">{children}</div>;
}
