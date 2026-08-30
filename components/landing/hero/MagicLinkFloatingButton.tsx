"use client";

import { useState } from "react";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function MagicLinkFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Enter RapYard with Magic Link"
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-6
          left-1/2
          z-50
          w-[calc(100%-2rem)]
          max-w-md
          -translate-x-1/2
          overflow-hidden
          rounded-xl
          border-2
          border-orange-500
          bg-black/90
          px-6
          py-4
          text-center
          shadow-[0_0_40px_rgba(249,115,22,0.55)]
          backdrop-blur-xl
          transition-all
          duration-300
          hover:bg-orange-500/15
          hover:shadow-[0_0_55px_rgba(249,115,22,0.75)]
          active:scale-[0.99]
          sm:bottom-8
          sm:px-10
          sm:py-5
        "
      >
        <span className="block text-xl font-black uppercase tracking-[0.12em] text-white sm:text-2xl">
          Enter The Yard
        </span>

        <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.28em] text-orange-400 sm:text-xs">
          Sign In With Magic Link
        </span>
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/80
            px-4
            backdrop-blur-md
          "
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="RapYard Magic Link Sign In"
            className="
              relative
              w-full
              max-w-2xl
              rounded-2xl
              border
              border-orange-500/40
              bg-black/95
              p-6
              shadow-[0_0_70px_rgba(249,115,22,0.22)]
              sm:p-8
            "
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close Magic Link sign in"
              onClick={() => setOpen(false)}
              className="
                absolute
                right-4
                top-4
                rounded-lg
                border
                border-white/10
                bg-zinc-900
                px-3
                py-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-zinc-300
                transition
                hover:border-orange-500/50
                hover:text-white
              "
            >
              Close
            </button>

            <div className="pt-8">
              <MagicLinkForm
                onSuccess={() => {
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
