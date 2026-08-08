import { createClient } from "@/lib/supabase/client";
import type { RecordingTake } from "@/lib/audio/types";

export async function renameTake(
  id: string,
  title: string
): Promise<RecordingTake> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recording_takes")
    .update({
      title,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as RecordingTake;
}