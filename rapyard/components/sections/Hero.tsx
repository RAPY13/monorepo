"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/logo";
import Smoke from "@/components/effects/Smoke";
import Embers from "@/components/effects/Embers";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-black px-6 py-24 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,140,0,0.12),_transparent_45%)]" />

      <Logo />
      <Smoke />
      <Embers />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Forge the future of your brand.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-lg text-zinc-300 sm:text-xl"
        >
          We build bold digital experiences that feel cinematic, fast, and unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#work"
            className="rounded-full border border-orange-400/40 bg-orange-500/10 px-6 py-3 text-sm font-medium text-orange-200 transition hover:bg-orange-500/20"
          >
            View our work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Start a project
          </a>
        </motion.div>
      </div>
    </section>
  );
}