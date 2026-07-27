"use client";

import { ShieldCheck, Sparkles } from "lucide-react";

export default function HeroCTA() {
  return (
    <div
      data-hero="cta"
      className="mx-auto mt-10 max-w-2xl text-center"
    >
      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.03]
          px-8
          py-8
          backdrop-blur-xl
        "
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-orange-500/10 p-3">
            <ShieldCheck className="h-6 w-6 text-orange-400" />
          </div>
        </div>

        <h3
          className="
            mt-6
            text-lg
            font-bold
            uppercase
            tracking-[0.3em]
            text-white
          "
        >
          Founders Edition
        </h3>

        <p
          className="
            mt-5
            text-base
            leading-8
            text-slate-300
          "
        >
          Early members receive priority access as RapYard opens its gates.
        </p>

        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
            text-sm
            text-orange-300
          "
        >
          <Sparkles className="h-4 w-4" />
          <span>Built for creators. Powered by the culture.</span>
        </div>

        <p
          className="
            mt-6
            text-sm
            leading-7
            text-slate-500
          "
        >
          Your Magic Link is passwordless, secure, and used only to access your
          RapYard account. No passwords to remember. No spam.
        </p>
      </div>
    </div>
  );
}