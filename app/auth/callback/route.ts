import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  const code = requestUrl.searchParams.get("code");

  // Authorization code is required.
  if (!code) {
    console.error("[Auth Callback] Missing authorization code");

    return NextResponse.redirect(
      new URL("/gate?error=missing_code", origin),
    );
  }

  const cookieStore = await cookies();
  const response = NextResponse.next();

  function redirectWithSession(path: string) {
    const redirectResponse = NextResponse.redirect(
      new URL(path, origin),
    );

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set({
                name,
                value,
                ...options,
              });
            },
          );
        },
      },
    },
  );

  const { data, error } =
    await supabase.auth.exchangeCodeForSession(code);

  console.log(
    "[Auth Callback] Cookies after exchange:",
    response.cookies.getAll().map((cookie) => cookie.name),
  );

  if (error) {
    console.error(
      "[Auth Callback] exchangeCodeForSession failed:",
      error.message,
    );

    const errorUrl = new URL("/gate", origin);

    errorUrl.searchParams.set("error", "auth");
    errorUrl.searchParams.set(
      "message",
      error.message,
    );

    return redirectWithSession(
      `${errorUrl.pathname}${errorUrl.search}`,
    );
  }

  if (!data.session || !data.user) {
    console.error("[Auth Callback] No session returned");

    return redirectWithSession("/gate?error=no_session");
  }

  const { data: profile, error: profileLookupError } =
    await supabase
      .from("profiles")
      .select("id, onboarding_complete")
      .eq("id", data.user.id)
      .maybeSingle();

  if (profileLookupError) {
    console.error(
      "[Auth Callback] Profile lookup failed:",
      profileLookupError.message,
    );

    return redirectWithSession("/gate?error=profile_lookup");
  }

  if (!profile) {
    const { error: createProfileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        username: null,
        rap_name: null,
        onboarding_complete: false,
      });

    if (createProfileError && createProfileError.code !== "23505") {
      console.error(
        "[Auth Callback] Profile creation failed:",
        createProfileError.message,
      );

      return redirectWithSession("/gate?error=profile_create");
    }

    return redirectWithSession("/rap-sheet");
  }

  if (!profile.onboarding_complete) {
    return redirectWithSession("/rap-sheet");
  }

  console.log(
    "[Auth Callback] Session established successfully",
    {
      user: data.user.email ?? data.user.id,
    },
  );

  return redirectWithSession("/yard");
}
