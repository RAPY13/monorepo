import { NextResponse } from "next/server";

async function handle(request: Request) {
  const url = new URL(request.url);
  const dest = url.searchParams.get("dest") || "/";

  const cookie = request.headers.get("cookie") || "";
  const hasAuth = cookie.includes("rapyard-auth=");

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  // Authorized: rewrite to the intended destination within the app.
  return NextResponse.rewrite(new URL(dest, request.url));
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
