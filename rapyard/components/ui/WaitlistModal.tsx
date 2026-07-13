"use client";

import { FormEvent } from "react";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  onClose: () => void;
  enterYard: (e: FormEvent<HTMLFormElement>) => Promise<void>;
};

export default function AccountModal({ email, setEmail, onClose, enterYard }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-black/90 p-6">
        <form onSubmit={enterYard} className="space-y-4">
          <div>
            <label className="block text-left text-sm uppercase tracking-[0.35em] text-zinc-300" htmlFor="modal-email">
              Enter your email
            </label>
            <input
              id="modal-email"
              type="email"
              required
              autoFocus
              placeholder=""
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-4 text-white placeholder:text-white/40 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 rounded-2xl px-4 py-2 text-sm text-white/80 border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-yellow-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
