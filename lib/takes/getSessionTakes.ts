import { createClient } from "@/lib/supabase/client";
import type { RecordingTake } from "@/lib/audio/types";

export async function getSessionTakes(
  sessionId: string
): Promise<RecordingTake[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recording_takes")
    .select("*")
    .eq("session_id", sessionId)
    .order("take_number", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as RecordingTake[];
}