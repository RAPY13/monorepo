import { createClient } from "./client";

const supabase = createClient();

export async function uploadToBucket(
  bucket: string,
  file: File,
): Promise<{ path: string; url: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const safeName = file.name.replace(/\s+/g, "-");
  const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl.publicUrl,
  };
}
