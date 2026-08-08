"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroBleedThaBlock() {
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          y: 24,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        },
      );
    }, imageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={imageRef}
      data-hero="bleed-tha-block"
      className="
        relative
        z-40
        flex
        w-full
        justify-center
        px-6
        pb-24
        pt-8
      "
    >
      <Image
        src="/images/hero/Bleed-Tha-Block-Label.png"
        alt="Bleed Tha Block Label"
        width={1200}
        height={650}
        priority
        quality={100}
        className="
          h-auto
          w-[420px]
          max-w-full
          select-none
          drop-shadow-[0_0_70px_rgba(255,80,0,.45)]
          md:w-[650px]
          lg:w-[820px]
          xl:w-[900px]
        "
      />
    </div>
  );
}