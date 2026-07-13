import { NextResponse } from "next/server";

function isLocalPath(dest: string) {
  return dest.startsWith("/") && !dest.startsWith("//");
}

async function handle(request: Request) {
  const url = new URL(request.url);
  const dest = url.searchParams.get("dest") ?? "/";

  // Only allow internal paths
  const safeDest = isLocalPath(dest) ? dest : "/";

  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasAuth = cookieHeader.includes("rapyard-auth="); // replace w/ real session check later

  if (!hasAuth) {
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  return NextResponse.rewrite(new URL(safeDest, request.url));
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}