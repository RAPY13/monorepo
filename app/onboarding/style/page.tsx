"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const ALL_TAGS = [
  "Minimal",
  "Bold",
  "Techwear",
  "Vintage",
  "Neon",
  "Monochrome",
  "Street",
  "Preppy",
];

export default function OnboardingStylePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  async function submit() {
    setLoading(true);
    setErr(null);

    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ style_tags: selected })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/onboarding/avatar");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save style tags");
    } finally {
      setLoading(false);
    }
  }

  const canContinue = selected.length > 0;

  const tags = useMemo(() => ALL_TAGS, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Pick your style tags</h1>
      <p style={{ opacity: 0.8 }}>Select at least one.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
        {tags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                border: active ? "2px solid #111" : "1px solid #999",
                background: active ? "#111" : "transparent",
                color: active ? "#fff" : "#111",
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <button
        onClick={submit}
        disabled={loading || !canContinue}
        style={{ marginTop: 20 }}
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}