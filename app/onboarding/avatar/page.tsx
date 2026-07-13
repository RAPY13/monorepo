"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function OnboardingAvatarPage() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function skipOrSave(nextUrl: string | null) {
    setLoading(true);
    setErr(null);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Not authenticated");

      const payload = nextUrl ? { avatar_url: nextUrl } : { avatar_url: null };

      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);

      if (error) throw error;

      router.push("/onboarding/bio");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save avatar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Avatar</h1>
      <p style={{ opacity: 0.8 }}>Optional — you can add later.</p>

      <label style={{ display: "block", marginTop: 16 }}>
        Avatar URL
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          style={{ display: "block", width: 420, padding: 8, marginTop: 8 }}
        />
      </label>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button
          onClick={() => skipOrSave(null)}
          disabled={loading}
        >
          Skip
        </button>

        <button
          onClick={() => skipOrSave(avatarUrl.trim() || null)}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}