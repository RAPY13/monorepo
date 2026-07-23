import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * POST /api/auth/email-login
 * Sends a Supabase magic-link to the given email address.
 * On success the user receives an email; clicking the link
 * exchanges the token at /auth/confirm and establishes a session.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const email =
    typeof body?.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Auth service is temporarily unavailable." },
      { status: 503 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const origin = new URL(request.url).origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("[email-login] signInWithOtp failed", error.message);
    return NextResponse.json(
      { error: "Unable to send login link. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Check your email for a login link." },
    { status: 200 }
  );
}
