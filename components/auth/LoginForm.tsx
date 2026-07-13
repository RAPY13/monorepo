"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleLogin}
      className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-8"
    >
      <h1 className="text-center text-3xl font-black uppercase text-white">
        Welcome Back
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
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
