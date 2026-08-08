import { createClient } from "@/lib/supabase/client";

export async function getRecordingUrl(
  storagePath: string,
) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      "You must be signed in to play this recording.",
    );
  }

  const { data, error } =
    await supabase.storage
      .from("recordings")
      .createSignedUrl(
        storagePath,
        60 * 60,
      );

  if (error || !data?.signedUrl) {
    throw new Error(
      error?.message ||
        "Unable to load recording.",
    );
  }

  return data.signedUrl;
}