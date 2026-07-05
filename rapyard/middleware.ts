import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/role", "/tenant", "/feed", "/profile", "/help"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("rapyard-auth")?.value;

  if (!authCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/role/:path*", "/tenant/:path*", "/feed/:path*", "/profile/:path*", "/help/:path*"],
};
