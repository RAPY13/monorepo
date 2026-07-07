"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ProfileRow } from "@/types/profile";

type UseProfileResult = {
  profile: ProfileRow | null;
  loading: boolean;
  error: string | null;
};

export default function useProfile(userId: string | null): UseProfileResult {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url, badges")
        .eq("id", userId)
        .maybeSingle<ProfileRow>();

      if (cancelled) return;

      if (!profileError) {
        setProfile(data ?? null);
        setLoading(false);
        return;
      }

      const { data: fallbackData, error: fallbackError } = await supabase
        .from("profiles")
        .select("username, avatar_url, badges")
        .eq("user_id", userId)
        .maybeSingle<ProfileRow>();

      if (cancelled) return;

      if (fallbackError) {
        setError(profileError.message);
      } else {
        setProfile(fallbackData ?? null);
      }
      setLoading(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, loading, error };
}
