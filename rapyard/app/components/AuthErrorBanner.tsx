"use client";

import { useSearchParams } from "next/navigation";

const OTP_ERROR_MESSAGES: Record<string, string> = {
  otp_expired: "Your sign-in link has expired. Please request a new one.",
  otp_disabled: "Magic link sign-in is not available. Please contact support.",
};

const FALLBACK_MESSAGE = "Sign-in failed. Please try again.";

export default function AuthErrorBanner() {
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("error_code");

  if (!errorCode) {
    return null;
  }

  const message = OTP_ERROR_MESSAGES[errorCode] ?? FALLBACK_MESSAGE;

  return (
    <div
      role="alert"
      className="fixed left-1/2 top-6 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-red-500/40 bg-black/90 px-6 py-4 text-center shadow-2xl backdrop-blur-md"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Sign-in error</p>
      <p className="mt-1 text-base text-zinc-200">{message}</p>
    </div>
  );
}
