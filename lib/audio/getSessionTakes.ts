import { createClient } from "@/lib/supabase/client";

export async function getSessionTakes(
  sessionId: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recording_takes")
    .select(`
      id,
      session_id,
      take_number,
      title,
      storage_path,
      duration,
      size,
      mime_type,
      waveform,
      analysis,
      mastered_path,
      favorite,
      created_at
    `)
    .eq("session_id", sessionId)
    .order("take_number", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}