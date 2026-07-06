"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    redirect("/auth/magic-link?error=invalid_email");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm`,
    },
  });

  if (error) {
    console.error("[magic-link] signInWithOtp error:", error.message);
    redirect(
      `/auth/magic-link?error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect("/auth/magic-link?sent=1");
}
