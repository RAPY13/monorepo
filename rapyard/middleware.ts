import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Call your Cloudflare SSR Worker
  const res = await fetch("https://rapyard.club/auth-ssr", {
    method: "GET",
    headers: request.headers
  });

  const { user, session } = await res.json();

  // No user → send to landing
  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Founder-only gate
  if (request.nextUrl.pathname.startsWith("/founder-room")) {
    if (user.user_metadata.role !== "founder") {
      return NextResponse.redirect(new URL("/founder-required", request.url));
    }
  }

  // Flow-based routing
  switch (user.user_metadata.flow_stage) {
    case "CreateAccount":
      return NextResponse.redirect(new URL("/signup", request.url));
    case "VerifyEmail":
      return NextResponse.redirect(new URL("/verify", request.url));
    case "FounderBadge":
      return NextResponse.redirect(new URL("/founder", request.url));
    case "PickYourLane":
      return NextResponse.redirect(new URL("/lane", request.url));
  }

  return NextResponse.next();
}
