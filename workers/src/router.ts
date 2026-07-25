import { createClient } from "@supabase/supabase-js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const supabase = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY,
      { global: { fetch }, auth: { persistSession: false } }
    );

    // Check session cookie
    const accessToken = request.headers.get("Authorization")?.replace("Bearer ", "");

    const isAuthed = accessToken
      ? (await supabase.auth.getUser(accessToken)).data.user
      : null;

    // Public route
    if (path.startsWith("/gate")) {
      return env.PAGES.fetch(request);
    }

    // Protected routes
    if (path.startsWith("/yard") || path.startsWith("/profile")) {
      if (!isAuthed) {
        return Response.redirect(url.origin + "/gate", 302);
      }
      return env.PAGES.fetch(request);
    }

    // Default: proxy to Pages
    return env.PAGES.fetch(request);
  }
};
