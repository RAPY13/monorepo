import { createClient } from "@supabase/supabase-js";

interface WorkerEnv {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  PAGES: Fetcher;
}

export default {
  async fetch(
    request: Request,
    env: WorkerEnv,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      {
        global: {
          fetch,
        },
        auth: {
          persistSession: false,
        },
      },
    );

    const accessToken = request.headers
      .get("Authorization")
      ?.replace(/^Bearer\s+/i, "");

    const isAuthed = accessToken
      ? (await supabase.auth.getUser(accessToken)).data.user
      : null;

    // Public route
    if (path.startsWith("/gate")) {
      return env.PAGES.fetch(request);
    }

    // Protected routes
    if (
      path.startsWith("/yard") ||
      path.startsWith("/profile")
    ) {
      if (!isAuthed) {
        return Response.redirect(
          new URL("/gate", url.origin),
          302,
        );
      }

      return env.PAGES.fetch(request);
    }

    // Default: proxy to Pages
    return env.PAGES.fetch(request);
  },
};