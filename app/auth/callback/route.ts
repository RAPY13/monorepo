import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin } = url;

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/gate";

  if (!code) {
    return NextResponse.redirect(
      new URL("/gate?error=missing_code", origin)
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          cookieStore.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Supabase auth error:", error.message);

    return NextResponse.redirect(
      new URL("/gate?error=auth", origin)
    );
  }

  // Allow only internal redirects.
  const destination =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/gate";

  return NextResponse.redirect(
    new URL(destination, origin)
  );
}