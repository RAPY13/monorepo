import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next");

  // Only allow internal application redirects.
  const next =
    nextParam &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/gate";

  const origin = url.origin;

  // No authorization code means Supabase did not return
  // a usable PKCE callback.
  if (!code) {
    console.error("[Auth Callback] Missing authorization code", {
      url: request.url,
    });

    return NextResponse.redirect(
      new URL(
        "/gate?error=missing_code",
        origin,
      ),
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
    },
  );

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "[Auth Callback] exchangeCodeForSession failed:",
      error.message,
    );

    const errorUrl = new URL("/gate", origin);

    errorUrl.searchParams.set(
      "error",
      "auth",
    );

    errorUrl.searchParams.set(
      "message",
      error.message,
    );

    return NextResponse.redirect(errorUrl);
  }

  console.log(
    "[Auth Callback] Session established successfully",
  );

  return NextResponse.redirect(
    new URL(next, origin),
  );
}