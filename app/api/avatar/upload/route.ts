import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  // 1) Verify user session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2) Parse multipart/form-data
  const form = await req.formData();
  const file = form.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "Missing file" },
      { status: 400 }
    );
  }

  // 3) Build storage path
  const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`;

  // 4) Upload to Supabase Storage (avatars bucket)
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  // 5) Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // 6) Update profile row
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  // 7) Return success
  return NextResponse.json({
    ok: true,
    url: publicUrl,
    path: filePath,
  });
}
