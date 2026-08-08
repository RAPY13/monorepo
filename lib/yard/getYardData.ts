import { createClient } from "@/lib/supabase/server";

export async function getYardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    profileResult,
    projectsResult,
    recordingsResult,
    beatsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single(),

    supabase
      .from("projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("recordings")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("beats")
      .select("*")
      .eq("visibility", "public")
      .order("play_count", {
        ascending: false,
      })
      .limit(6),
  ]);

  return {
    profile: profileResult.data,
    projects: projectsResult.data ?? [],
    recordings: recordingsResult.data ?? [],
    beats: beatsResult.data ?? [],
  };
}