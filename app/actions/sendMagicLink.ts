"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(email: string) {
  console.log(
    "NEXT_PUBLIC_SITE_URL:",
    process.env.NEXT_PUBLIC_SITE_URL
  );

  const supabase = await createClient();

  const redirectUrl = "https://rapyard.club/auth/callback?next=/gate";

  console.log("Redirect URL:", redirectUrl);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
