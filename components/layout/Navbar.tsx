"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-white/10 bg-black/40 px-6 py-5 backdrop-blur-xl">
        <Link
          href="/"
          className="chrome-text text-xl font-black tracking-[0.3em]"
        >
          RAPYARD
        </Link>

        <nav className="hidden gap-10 text-sm uppercase tracking-[0.25em] text-zinc-300 md:flex">
          <a href="#forge" className="transition hover:text-orange-400">
            Forge
          </a>

          <a href="#districts" className="transition hover:text-orange-400">
            Districts
          </a>

          <a href="#magic-link" className="transition hover:text-orange-400">
            Join
          </a>
        </nav>

        <a
          href="#magic-link"
          className="rounded-xl border border-orange-500 px-5 py-2 text-sm font-bold uppercase tracking-[0.25em] text-orange-400 transition hover:bg-orange-500 hover:text-black"
        >
          Enter
        </a>
      </div>
    </motion.header>
  );
}