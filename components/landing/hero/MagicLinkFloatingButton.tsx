"use client";

import { useState } from "react";
import MagicLinkForm from "@/components/auth/MagicLinkForm";

export default function MagicLinkFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Open Magic Link"
        onClick={() => setOpen(true)}
        className={
          "magic-floating-btn fixed bottom-8 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.45)] transition-transform duration-200 hover:scale-105"
        }
      >
        {/* simple bolt icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
        >
          <path d="M11 21a1 1 0 01-.876-1.516L13.5 14H8a1 1 0 01-.8-1.6l6-8A1 1 0 0114.6 4l-6 8H16a1 1 0 01.876 1.516L12.5 20H11z" />
        </svg>
      </button>

      {open && (
        <div className="magic-modal-overlay fixed inset-0 z-40 flex items-center justify-center">
          <div className="magic-modal relative mx-4 w-full max-w-lg rounded-2xl border border-orange-500/30 bg-black/85 p-6 backdrop-blur-md">
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-md bg-zinc-900/60 px-3 py-1 text-sm text-zinc-200"
            >
              Close
            </button>

            <h3 className="mb-4 text-center text-lg font-bold">Enter with Magic Link</h3>

            <MagicLinkForm
              onSuccess={(_dest) => {
                // Close modal after the magic link is sent.
                // Actual authentication and redirect to `/rap-sheet`
                // will occur when the user follows the emailed link
                // and the `/auth/callback` route exchanges the code.
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
