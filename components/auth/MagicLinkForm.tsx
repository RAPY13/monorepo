"use client";

import { useState, useTransition } from "react";
import { sendMagicLink } from "@/app/actions/sendMagicLink";
import Toast from "@/components/ui/Toast";

type Props = {
  onSuccess?: (destination?: string) => void;
};

export default function MagicLinkForm({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
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
        const res = await sendMagicLink(trimmedEmail);

        if (res && res.success) {
          const successMsg =
            "Your Gate Pass has been sent. Check your email to unlock the entrance to RapYard.";

          setMessage(successMsg);
          setShowToast(true);
          setEmail("");

          if (onSuccess) onSuccess("/rap-sheet");
        } else {
          setIsError(true);

          setMessage(
            (res && (res as any).error) ||
              "Unable to send your Gate Pass. Please try again.",
          );
        }
      } catch (err) {
        setIsError(true);

        setMessage(
          err instanceof Error
            ? err.message
            : "Unable to send your Gate Pass. Please try again.",
        );
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="mb-5 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
          Your Gate Pass
        </p>

        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
          Enter Your Email
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          We&apos;ll send you a secure Magic Link to enter RapYard.
        </p>
      </div>

      <label
        htmlFor="rapyard-email"
        className="mb-2 block text-left text-xs font-bold uppercase tracking-[0.2em] text-zinc-400"
      >
        Email Address
      </label>

      <input
        id="rapyard-email"
        type="email"
        autoComplete="email"
        required
        disabled={isPending}
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);

          if (message) {
            setMessage("");
            setIsError(false);
          }
        }}
        className="w-full rounded-xl border border-white/15 bg-black/80 px-5 py-5 text-base text-white shadow-inner outline-none transition duration-300 placeholder:text-zinc-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      />

      <button
        type="submit"
        disabled={isPending}
        className="group relative mt-5 w-full overflow-hidden rounded-xl border-2 border-orange-500 bg-orange-500/10 px-6 py-5 text-center transition-all duration-300 hover:bg-orange-500/20 hover:shadow-[0_0_45px_rgba(249,115,22,0.55)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-6"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18),transparent_65%)]" />

        <span className="relative block text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
          {isPending ? "Sending Gate Pass..." : "Enter The Yard"}
        </span>

        {!isPending && (
          <span className="relative mt-1 block text-xs font-black uppercase tracking-[0.3em] text-orange-400 sm:text-sm">
            Sign In With Magic Link
          </span>
        )}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
        Passwordless · Secure · No password to remember
      </p>

      {message && (
        <div
          aria-live="polite"
          className={`mt-5 rounded-lg border px-4 py-3 text-center text-sm ${
            isError
              ? "border-red-500/40 bg-red-950/30 text-red-300"
              : "border-emerald-500/30 bg-emerald-950/20 text-emerald-300"
          }`}
        >
          {message}
        </div>
      )}

      <Toast
        message={showToast ? message : ""}
        variant={isError ? "error" : "success"}
        onClose={() => {
          setShowToast(false);
        }}
      />
    </form>
  );
}
