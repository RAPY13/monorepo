import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

const WINDOW_MS = 15 * 60 * 1000; // 15-minute sliding window
const MAX_ATTEMPTS = 5;

type DbStatement = {
  bind: (...values: unknown[]) => DbStatement;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type DbLike = {
  prepare: (query: string) => DbStatement;
};

async function getDb() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv & { DB?: DbLike }).DB ?? null;
  } catch {
    return null;
  }
}

/**
 * POST /api/auth/throttle-admin
 * Records an admin login attempt for the requesting IP and returns
 * whether the caller should be throttled.
 *
 * Uses Cloudflare D1 when available; fails open (allows the request)
 * in local / non-Cloudflare environments where D1 is absent.
 */
export async function POST(request: Request) {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const db = await getDb();

  if (!db) {
    return NextResponse.json({ throttled: false }, { status: 200 });
  }

  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  try {
    // NOTE: there is an inherent check-then-insert race for highly concurrent
    // requests on the same IP.  For this use-case (admin login throttle) the
    // small window of allowing one or two extra attempts per burst is
    // acceptable.  A production hardening path would use a D1 atomic upsert
    // or the Cloudflare Rate Limiting API instead.
    const row = await db
      .prepare(
        "SELECT COUNT(*) AS attempts FROM auth_throttle WHERE ip = ? AND created_at > ?"
      )
      .bind(ip, windowStart)
      .first<{ attempts: number }>();

    const attempts = parseInt(String(row?.attempts ?? 0), 10) || 0;

    if (attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          throttled: true,
          error: "Too many login attempts. Please try again later.",
        },
        { status: 429 }
      );
    }

    await db
      .prepare(
        "INSERT INTO auth_throttle (ip, created_at) VALUES (?, ?)"
      )
      .bind(ip, now)
      .run();

    return NextResponse.json({ throttled: false }, { status: 200 });
  } catch {
    // auth_throttle table not yet migrated — fail open so login works
    return NextResponse.json({ throttled: false }, { status: 200 });
  }
}
