"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPassword() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function resetPassword() {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    setMessage("Password reset email sent.");
  }

  return (
    <div className="space-y-4">
      <input
        className="w-full rounded-lg bg-zinc-900 p-3 text-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={resetPassword}
        className="rounded-lg bg-yellow-400 px-5 py-3 font-bold text-black"
      >
        Reset Password
      </button>

      {message && (
        <p className="text-green-400">{message}</p>
      )}
    </div>
  );
}
