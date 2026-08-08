import { createClient } from "@/lib/supabase/server";

export async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [
    profile,
    projects,
    battles,
    beats,
    notifications,
  ] = await Promise.all([

    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single(),

    supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId)
      .order("updated_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("battles")
      .select("*")
      .limit(5),

    supabase
      .from("beats")
      .select("*")
      .limit(5),

    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .limit(10),
  ]);

  return {
    profile: profile.data,
    projects: projects.data ?? [],
    battles: battles.data ?? [],
    beats: beats.data ?? [],
    notifications: notifications.data ?? [],
  };
}