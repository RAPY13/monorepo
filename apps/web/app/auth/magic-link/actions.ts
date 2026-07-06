"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function sendMagicLink(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    redirect("/auth/magic-link?error=invalid_email");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    redirect(
      `/auth/magic-link?error=${encodeURIComponent("NEXT_PUBLIC_SITE_URL is not set")}`,
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
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
