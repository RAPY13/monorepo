import { createClient } from "@/lib/supabase/client";

export async function deleteTake(
  takeId: string
): Promise<void> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("recording_takes")
    .select("storage_path")
    .eq("id", takeId)
    .single();

  if (error) {
    throw error;
  }

  const { error: storageError } =
    await supabase.storage
      .from("recordings")
      .remove([data.storage_path]);

  if (storageError) {
    throw storageError;
  }

  const { error: deleteError } =
    await supabase
      .from("recording_takes")
      .delete()
      .eq("id", takeId);

  if (deleteError) {
    throw deleteError;
  }
}