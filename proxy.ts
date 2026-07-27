import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const protectedPrefixes = [
  "/yard",
  "/booth",
  "/battles",
  "/feed",
  "/profile",
  "/role",
  "/tenant",
  "/help",
];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { response, supabase } = await updateSession(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Supabase auth error:", error);
  }

  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    const url = request.nextUrl.clone();

    url.pathname = "/gate";

    // Preserve the original destination
    url.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/yard/:path*",
    "/booth/:path*",
    "/battles/:path*",
    "/feed/:path*",
    "/profile/:path*",
    "/role/:path*",
    "/tenant/:path*",
    "/help/:path*",
  ],
};