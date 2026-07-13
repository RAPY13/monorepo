"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);
  setError("");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("SIGNUP DATA:", data);
  console.log("SIGNUP ERROR:", error);

  setLoading(false);

  if (error) {
    setError(error.message);
    return;
  }

  if (!data.user) {
    setError("No user was returned from Supabase.");
    return;
  }

  router.push("/role");
}

  return (
    <form
      onSubmit={handleSignup}
      className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-8"
    >
      <h1 className="text-center text-3xl font-black uppercase text-white">
        Join RapYard
      </h1>

      <input
        className="rounded-lg bg-zinc-900 p-3 text-white"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="rounded-lg bg-zinc-900 p-3 text-white"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        disabled={loading}
        className="rounded-lg bg-yellow-400 p-3 font-bold text-black transition hover:bg-yellow-300"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}
