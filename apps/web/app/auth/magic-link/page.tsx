import { sendMagicLink } from "./actions";

interface Props {
  searchParams: Promise<{ sent?: string; error?: string }>;
}

export default async function MagicLinkPage({ searchParams }: Props) {
  const { sent, error } = await searchParams;

  return (
    <main style={{ maxWidth: 400, margin: "80px auto", fontFamily: "sans-serif" }}>
      <h1>Sign in with Magic Link</h1>

      {sent && (
        <p style={{ color: "green" }}>
          Check your email — a magic link is on its way.
        </p>
      )}

      {error && (
        <p style={{ color: "red" }}>
          Error: {decodeURIComponent(error)}
        </p>
      )}

      <form action={sendMagicLink}>
        <label htmlFor="email">Email address</label>
        <br />
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          style={{ width: "100%", padding: "8px", marginTop: 4 }}
        />
        <br />
        <button
          type="submit"
          style={{ marginTop: 12, padding: "8px 16px", cursor: "pointer" }}
        >
          Send Magic Link
        </button>
      </form>

      {/* Debug helper: shows the confirm URL format expected by /auth/confirm */}
      <details style={{ marginTop: 32, fontSize: 12, color: "#666" }}>
        <summary>Debug info</summary>
        <p>
          Magic links redirect to{" "}
          <code>/auth/confirm?token_hash=…&amp;type=magiclink</code>
        </p>
        <p>
          The confirm route calls <code>supabase.auth.verifyOtp</code>, sets the
          session cookie, then redirects to <code>/?next=/</code> (or the{" "}
          <code>next</code> query param).
        </p>
        <p>
          To debug delivery issues, check{" "}
          <strong>Supabase Dashboard → Logs → Auth</strong> and look for{" "}
          <em>email handover</em> errors after triggering a new sign-in.
        </p>
      </details>
    </main>
  );
}
