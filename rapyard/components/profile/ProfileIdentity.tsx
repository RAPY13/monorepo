"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ProfileRow } from "@/types/profile";

export default function ProfileIdentity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError) {
        setError(userError.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setError("No authenticated Supabase user found.");
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("username, avatar_url, badges")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (cancelled) {
        return;
      }

      if (!profileError) {
        setProfile(data ?? null);
        setLoading(false);
        return;
      }

      const { data: fallbackData, error: fallbackError } = await supabase
        .from("profiles")
        .select("username, avatar_url, badges")
        .eq("user_id", user.id)
        .maybeSingle<ProfileRow>();

      if (fallbackError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(fallbackData ?? null);
      setLoading(false);
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasFounderBadge = useMemo(
    () => profile?.badges?.includes("founder") ?? false,
    [profile?.badges]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Identity</p>
        <p className="mt-3 text-zinc-300">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">Profile error</p>
        <p className="mt-3 text-sm text-zinc-200">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Identity</p>
        <p className="mt-3 text-zinc-300">No profile row found yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-5">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Identity</p>

      <div className="mt-4 flex items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile avatar"
            className="h-14 w-14 rounded-full border border-white/15 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.2em] text-zinc-300">
            No Avatar
          </div>
        )}

        <div className="profile-name flex items-center gap-3">
          <span className="username text-xl font-bold text-white">
            {profile.username || "Unnamed user"}
          </span>

          {hasFounderBadge && (
            <span className="badge badge-founder">Founder</span>
          )}
        </div>
      </div>
    </div>
  );
}
