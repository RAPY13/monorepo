"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function OnboardingBioPage() {
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setErr(null);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Not authenticated");

      const payload = { bio: bio.trim() ? bio.trim() : null };

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);

      if (error) throw error;

      router.push("/gate");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save bio");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Bio</h1>
      <p style={{ opacity: 0.8 }}>Optional — keep it short and loud.</p>

      <label style={{ display: "block", marginTop: 16 }}>
        Bio
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us what you’re about..."
          style={{ display: "block", width: 520, height: 120, padding: 8, marginTop: 8 }}
        />
      </label>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <button onClick={submit} disabled={loading} style={{ marginTop: 20 }}>
        {loading ? "Saving..." : "Enter Gate"}
      </button>
    </div>
  );
}