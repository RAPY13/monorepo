"use client";

import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 z-50 w-full"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

        <h1 className="text-xl font-black tracking-[0.3em] text-white">
          RAPYARD
        </h1>

        <nav className="hidden gap-10 text-sm uppercase tracking-widest text-zinc-300 md:flex">
          <a href="#artists" className="hover:text-orange-400 transition">
            Artists
          </a>

          <a href="#producers" className="hover:text-orange-400 transition">
            Producers
          </a>

          <a href="#listeners" className="hover:text-orange-400 transition">
            Listeners
          </a>
        </nav>

        <button className="rounded-lg border border-orange-500 px-5 py-2 text-sm font-bold uppercase tracking-widest text-orange-400 transition hover:bg-orange-500 hover:text-black">
          Enter
        </button>

      </div>
    </motion.header>
  );
}
