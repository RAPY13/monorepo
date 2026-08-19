import { updateSession } from "@/utils/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { response } = await updateSession(request);

  return response;
}

export const config = {
  matcher: [
    "/yard/:path*",
    "/gate/:path*",
    "/booth/:path*",
    "/battles/:path*",
    "/feed/:path*",
    "/profile/:path*",
    "/role/:path*",
    "/tenant/:path*",
    "/help/:path*",
    "/rap-sheet/:path*",
    "/projects/:path*",
    "/beats/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/sessions/:path*",
  ],
};
