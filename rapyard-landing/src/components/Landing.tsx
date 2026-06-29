import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function Landing() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function signup(e) {
    e.preventDefault();

    await supabase.from("waitlist").insert({
      email,
      source: "landing-page"
    });

    setDone(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/gate-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-black mb-6">RAPYARD</h1>

          <p className="text-xl text-white/80 mb-10">
            Hip-hop never had a real home.<br />
            Not a place built by us, for us.<br />
            Not a place where bars matter, beats matter, and the work matters.
          </p>

          <h2 className="text-3xl font-bold mb-4">RAPYARD IS THAT HOME.</h2>

          {!done ? (
            <form
              onSubmit={signup}
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <input
                type="email"
                required
                placeholder="you@rapyard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/20"
              />

              <button className="w-full py-3 bg-yellow-500 text-black font-bold rounded">
                JOIN THE FOUNDERS LIST
              </button>
            </form>
          ) : (
            <p className="text-yellow-400 font-bold text-lg">
              You’re in. Welcome to the Founders List.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
