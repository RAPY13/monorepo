import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadFile(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  file: File | Blob | ArrayBuffer | ArrayBufferView,
  options?: { cacheControl?: string; upsert?: boolean },
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: options?.cacheControl ?? "3600",
      upsert: options?.upsert ?? false,
    });

  if (error) throw error;
}
