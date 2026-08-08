import { createClient } from "@/lib/supabase/client";
import { AUDIO_BUCKET } from "./constants";

export async function createSignedUrl(
  filePath: string
): Promise<string> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}