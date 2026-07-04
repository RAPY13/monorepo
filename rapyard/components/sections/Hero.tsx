"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/logo";
import Smoke from "@/components/effects/Smoke";
import Embers from "@/components/effects/Embers";

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-center px-6 py-24 text-white sm:px-8 lg:px-12"
      style={{ backgroundImage: "url('/LandingPage.png')" }}
    >
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,140,0,0.12),_transparent_45%)] mix-blend-screen" />

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
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-12 flex w-full flex-col items-center gap-6"
        >
          <div className="flex min-w-[22rem] flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.35em] text-zinc-200 sm:justify-center">
            {['BATTLES', 'RECORDING STUDIO', 'MARKETPLACE', 'CREATOR ROYALTIES', 'SOCIAL MEDIA VOTE'].map((label) => (
              <span
                key={label}
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm shadow-black/10 ${
                  label === 'SOCIAL MEDIA VOTE'
                    ? 'border border-red-400/40 bg-red-500/10 text-red-200'
                    : 'border border-white/15 bg-white/5 text-white'
                }`}
              >
                {label}
              </span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-4 inline-flex items-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-left text-sm text-white shadow-[0_18px_90px_rgba(255,0,0,0.12)] sm:mx-auto sm:max-w-2xl"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20 text-red-100 ring-1 ring-red-300/20">
              ❤️
            </span>
            <div>
              <p className="uppercase tracking-[0.35em] text-red-200">Listener Power</p>
              <p className="mt-1 text-sm text-zinc-100">Listeners vote here — no RAPY needed. React, share, and shape the leaderboard from the feed.</p>
            </div>
          </motion.div>

          <div className="h-px w-full max-w-4xl bg-white/15" />

          <div className="rounded-3xl border border-red-500/20 bg-black/40 px-6 py-5 text-center shadow-[0_20px_100px_rgba(0,0,0,0.35)] sm:px-8">
            <p className="text-sm uppercase tracking-[0.4em] text-red-300">Social Media Vote</p>
            <p className="mt-2 text-base font-semibold uppercase tracking-[0.28em] text-white sm:text-lg">
              For listeners — your vote makes the yard move.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 w-full max-w-xl"
        >
          <div className="space-y-4">
            <label className="block text-left text-sm uppercase tracking-[0.35em] text-zinc-300" htmlFor="email">
              Enter your email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@rapyard.com"
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-orange-400/80 focus:bg-white/10"
            />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-300">Pick your lane</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {['Rapper', 'Producer', 'Listener'].map((lane) => (
                  <label
                    key={lane}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-400/70"
                  >
                    <span>{lane}</span>
                    <input
                      type="radio"
                      name="lane"
                      value={lane.toLowerCase()}
                      className="h-4 w-4 accent-orange-400"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-red-500 px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-red-400"
            >
              Join the founders list
            </button>
          </div>
        </motion.form>
      </div>

      <div className="pointer-events-none absolute right-6 top-1/2 hidden h-[340px] w-56 -translate-y-1/2 rotate-2 flex-col justify-center text-right text-white lg:flex">
        <p className="text-xs uppercase tracking-[0.55em] text-zinc-300">Creators build the yard.</p>
        <p className="mt-4 text-3xl font-black uppercase tracking-[0.15em] text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.12)]">
          Listeners move the yard.
        </p>
        <span className="mt-5 inline-block h-0.5 w-20 bg-red-500 shadow-[0_0_16px_rgba(255,0,0,0.35)]" />
      </div>
    </section>
  );
}