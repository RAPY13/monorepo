"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "@/app/actions/sendMagicLink";

export default function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) return;

    setMessage("");
    setIsError(false);

    startTransition(async () => {
      try {
        await sendMagicLink(trimmedEmail);

        setMessage(
          "🔥 Your Gate Pass has been sent. Check your email to unlock the entrance to RapYard."
        );

        setEmail("");
      } catch (err) {
        setIsError(true);

        setMessage(
          err instanceof Error
            ? err.message
            : "Unable to send your Gate Pass. Please try again."
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-5"
    >
      <input
        type="email"
        autoComplete="email"
        required
        disabled={isPending}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);

          if (message) {
            setMessage("");
            setIsError(false);
          }
        }}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-4 text-white placeholder:text-zinc-500 outline-none transition duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-orange-500 px-5 py-4 font-bold uppercase tracking-wider text-black transition duration-300 hover:bg-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending Gate Pass..." : "ENTER THE YARD"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Secure passwordless sign in powered by Magic Link.
      </p>

      {message && (
        <div
          aria-live="polite"
          className={`rounded-lg border px-4 py-3 text-center text-sm ${
            isError
              ? "border-red-500/40 bg-red-950/30 text-red-300"
              : "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}