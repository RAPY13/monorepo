"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import FadeIn from "@/app/onboarding/_components/FadeIn";

export default function OnboardingLanePage() {
  const router = useRouter();
  const [lane, setLane] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setErr(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ lane })
        .eq("id", user.id); // <-- change "id" if your FK column differs

      if (error) throw error;

      router.push("/onboarding/style");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save lane");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div style={{ padding: 24 }}>
        <h1>Choose your lane</h1>

        <label style={{ display: "block", marginTop: 16 }}>
          Lane
          <input
            value={lane}
            onChange={(e) => setLane(e.target.value)}
            placeholder="e.g. Streetwear, Skate, Classic..."
            style={{
              display: "block",
              width: 320,
              padding: 8,
              marginTop: 8,
            }}
          />
        </label>

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        <button
          onClick={submit}
          disabled={loading || !lane.trim()}
          style={{ marginTop: 20 }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </FadeIn>
  );
}