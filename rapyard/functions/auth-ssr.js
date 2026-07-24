import { createServerClient } from "@supabase/ssr";

export async function onRequest(context) {
  const request = context.request;

  // Clone headers so we can modify them
  const requestHeaders = new Headers(request.headers);

  // Create a response placeholder
  let response = new Response(null, {
    headers: { "Content-Type": "application/json" }
  });

  // Create Supabase SSR client
  const supabase = createServerClient(
    context.env.SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return request.headers.get("Cookie")?.split("; ").map((cookie) => {
            const [name, ...rest] = cookie.split("=");
            return { name, value: rest.join("=") };
          }) || [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.headers.append(
              "Set-Cookie",
              `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`
            );
          });
        }
      }
    }
  );

  // Get user session
  const { data: sessionData } = await supabase.auth.getSession();
  const { data: userData } = await supabase.auth.getUser();

  // Return session + user to Next.js
  return new Response(
    JSON.stringify({
      session: sessionData.session,
      user: userData.user
    }),
    {
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(response.headers)
      }
    }
  );
}
