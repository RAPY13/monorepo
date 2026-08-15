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
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { response, user } =
    await updateSession(request);

  if (
    isProtectedPath(request.nextUrl.pathname) &&
    !user
  ) {
    const url = request.nextUrl.clone();

    url.pathname = "/gate";

    url.searchParams.set(
      "next",
      request.nextUrl.pathname +
        request.nextUrl.search
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