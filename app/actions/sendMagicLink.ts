"use server";

import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      success: false,
      error: "Email is required.",
    };
  }

  const supabase = await createClient();

  const redirectUrl =
    "https://rapyard.club/auth/callback?next=/rap-sheet";

  console.log("[Magic Link] Redirect URL:", redirectUrl);

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error(
      "[Magic Link] Supabase error:",
      error.message,
    );

    return {
      success: false,
      error: error.message,
    };
  }

  console.log(
    "[Magic Link] Sent successfully:",
    normalizedEmail,
  );

  return {
    success: true,
  };
}