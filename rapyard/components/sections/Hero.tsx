"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import ForgeGlow from "@/components/effects/ForgeGlow";
import Smoke from "@/components/effects/Smoke";
import Embers from "@/components/effects/Embers";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] text-white">

      <Navbar />

      <ForgeGlow />

      <Smoke />

      <Embers />

      <div className="relative z-20 mx-auto max-w-6xl px-6 text-center">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-6 inline-block rounded-full border border-orange-500/30 px-5 py-2 uppercase tracking-[0.35em] text-orange-400"
        >
          Founding Access
        </motion.div>

        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-7xl font-black tracking-tight md:text-[10rem]"
        >
          RAPYARD
        </motion.h1>

        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 1 }}
          className="mt-6 text-3xl font-bold md:text-6xl"
        >
          THE FORGE IS OPEN.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-10 max-w-3xl text-xl leading-9 text-zinc-300"
        >
          Hip-Hop never had a real home.
          <br />
          Built for artists.
          <br />
          Built for producers.
          <br />
          Built for listeners.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={() => router.push("/gate")}
          className="mt-16 rounded-xl border-2 border-orange-500 bg-orange-500/10 px-12 py-5 text-lg font-bold uppercase tracking-widest shadow-[0_0_60px_rgba(255,140,0,.25)] transition hover:bg-orange-500 hover:text-black"
        >
          ENTER THE YARD
        </motion.button>

      </div>

    </section>
  );
}
