import { createClient } from "@/lib/supabase/server";

export async function getProjectSessions(
  projectId: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("recording_sessions")
    .select(`
      id,
      project_id,
      title,
      notes,
      created_at,
      updated_at
    `)
    .eq("project_id", projectId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[getProjectSessions] Query failed:",
      error,
    );

    return [];
  }

  return data ?? [];
}