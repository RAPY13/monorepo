"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function sendMagicLink(email: string) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://rapyard.club/profile",
    },
  });

  if (error) throw new Error(error.message);
}
