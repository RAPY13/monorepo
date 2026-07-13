// lib/profile-actions.ts
import { createClient } from "@/utils/supabase/server";

export async function setLane(request, lane: string) {
  const supabase = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  await supabase.from("profiles").update({ lane }).eq("id", user.id);
}
