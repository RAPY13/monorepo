import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const WINDOW_SECONDS = 60;
const WINDOW_MS = WINDOW_SECONDS * 1000;
const MAX_REQUESTS_PER_WINDOW = 2;
const THROTTLE_TABLE = "auth_email_throttle_v2";
const THROTTLE_KIND_EMAIL = "email";
const THROTTLE_KIND_IP = "ip";
const CLEANUP_CHANCE = 0.05;

const emailFallbackState = new Map<string, { windowStartMs: number; requestCount: number; blockedUntilMs: number }>();
const ipFallbackState = new Map<string, { windowStartMs: number; requestCount: number; blockedUntilMs: number }>();
let ensureTablePromise: Promise<void> | null = null;

type D1Row = Record<string, unknown>;

type D1PreparedStatementLike = {
  bind: (...args: unknown[]) => {
    first: <T = D1Row>() => Promise<T | null>;
    run: () => Promise<unknown>;
  };
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
};

type CloudflareContextLike = {
  env?: {
    DB?: D1DatabaseLike;
  };
};

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(request: Request) {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!forwardedFor) {
    return "unknown";
  }

  const [firstIp] = forwardedFor.split(",");
  return firstIp?.trim() || "unknown";
}

function getRemainingSeconds(until: number) {
  return Math.max(Math.ceil((until - Date.now()) / 1000), 1);
}

function getCloudflareDatabase() {
  const key = Symbol.for("__cloudflare-context__");
  const context = (globalThis as Record<symbol, unknown>)[key] as CloudflareContextLike | undefined;
  return context?.env?.DB ?? null;
}

async function ensureThrottleTable(db: D1DatabaseLike) {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS ${THROTTLE_TABLE} (
            kind TEXT NOT NULL,
            throttle_key TEXT NOT NULL,
            window_started_ms INTEGER NOT NULL,
            request_count INTEGER NOT NULL,
            blocked_until_ms INTEGER NOT NULL,
            updated_at_ms INTEGER NOT NULL,
            PRIMARY KEY (kind, throttle_key)
          )`
        )
        .bind()
        .run();

      await db
        .prepare(
          `CREATE INDEX IF NOT EXISTS idx_${THROTTLE_TABLE}_blocked_until
           ON ${THROTTLE_TABLE} (blocked_until_ms)`
        )
        .bind()
        .run();
    })();
  }

  await ensureTablePromise;
}

async function getThrottleUntilD1(db: D1DatabaseLike, kind: string, key: string) {
  const row = await db
    .prepare(
      `SELECT window_started_ms, request_count, blocked_until_ms
       FROM ${THROTTLE_TABLE}
       WHERE kind = ?1 AND throttle_key = ?2
       LIMIT 1`
    )
    .bind(kind, key)
    .first<{ window_started_ms?: number; request_count?: number; blocked_until_ms?: number }>();

  return {
    windowStartMs: Number(row?.window_started_ms ?? 0),
    requestCount: Number(row?.request_count ?? 0),
    blockedUntilMs: Number(row?.blocked_until_ms ?? 0),
  };
}

async function upsertThrottleStateD1(
  db: D1DatabaseLike,
  kind: string,
  key: string,
  state: { windowStartMs: number; requestCount: number; blockedUntilMs: number }
) {
  await db
    .prepare(
      `INSERT INTO ${THROTTLE_TABLE} (kind, throttle_key, window_started_ms, request_count, blocked_until_ms, updated_at_ms)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT(kind, throttle_key)
       DO UPDATE SET
         window_started_ms = excluded.window_started_ms,
         request_count = excluded.request_count,
         blocked_until_ms = excluded.blocked_until_ms,
         updated_at_ms = excluded.updated_at_ms`
    )
    .bind(kind, key, state.windowStartMs, state.requestCount, state.blockedUntilMs, Date.now())
    .run();
}

async function maybeCleanupExpiredD1(db: D1DatabaseLike) {
  if (Math.random() > CLEANUP_CHANCE) {
    return;
  }

  await db
    .prepare(
      `DELETE FROM ${THROTTLE_TABLE}
       WHERE blocked_until_ms < ?1
         AND window_started_ms < ?2`
    )
    .bind(Date.now() - WINDOW_MS, Date.now() - WINDOW_MS)
    .run();
}

function evaluateWindowState(
  state: { windowStartMs: number; requestCount: number; blockedUntilMs: number } | null,
  now: number
) {
  const safeState = state ?? { windowStartMs: 0, requestCount: 0, blockedUntilMs: 0 };

  if (safeState.blockedUntilMs > now) {
    return {
      allowed: false,
      retryAfter: getRemainingSeconds(safeState.blockedUntilMs),
      nextState: safeState,
    };
  }

  const windowExpired = safeState.windowStartMs <= 0 || now - safeState.windowStartMs >= WINDOW_MS;

  if (windowExpired) {
    return {
      allowed: true,
      retryAfter: 0,
      nextState: {
        windowStartMs: now,
        requestCount: 1,
        blockedUntilMs: 0,
      },
    };
  }

  if (safeState.requestCount >= MAX_REQUESTS_PER_WINDOW) {
    const blockedUntilMs = Math.max(safeState.windowStartMs + WINDOW_MS, now + 1000);

    return {
      allowed: false,
      retryAfter: getRemainingSeconds(blockedUntilMs),
      nextState: {
        ...safeState,
        blockedUntilMs,
      },
    };
  }

  return {
    allowed: true,
    retryAfter: 0,
    nextState: {
      ...safeState,
      requestCount: safeState.requestCount + 1,
      blockedUntilMs: 0,
    },
  };
}

function getFallbackMap(kind: string) {
  return kind === THROTTLE_KIND_EMAIL ? emailFallbackState : ipFallbackState;
}

async function checkAndConsumeThrottleD1(db: D1DatabaseLike, kind: string, key: string, now: number) {
  const current = await getThrottleUntilD1(db, kind, key);
  const evaluated = evaluateWindowState(current, now);

  await upsertThrottleStateD1(db, kind, key, evaluated.nextState);

  return evaluated;
}

function checkAndConsumeThrottleFallback(kind: string, key: string, now: number) {
  const map = getFallbackMap(kind);
  const current = map.get(key) ?? null;
  const evaluated = evaluateWindowState(current, now);

  map.set(key, evaluated.nextState);

  return evaluated;
}

async function forceBlockD1(db: D1DatabaseLike, kind: string, key: string, now: number) {
  const current = await getThrottleUntilD1(db, kind, key);
  const blockedUntilMs = now + WINDOW_MS;

  await upsertThrottleStateD1(db, kind, key, {
    windowStartMs: current.windowStartMs > 0 ? current.windowStartMs : now,
    requestCount: Math.max(current.requestCount, MAX_REQUESTS_PER_WINDOW),
    blockedUntilMs,
  });
}

function forceBlockFallback(kind: string, key: string, now: number) {
  const map = getFallbackMap(kind);
  const current = map.get(key) ?? { windowStartMs: now, requestCount: 0, blockedUntilMs: 0 };

  map.set(key, {
    windowStartMs: current.windowStartMs > 0 ? current.windowStartMs : now,
    requestCount: Math.max(current.requestCount, MAX_REQUESTS_PER_WINDOW),
    blockedUntilMs: now + WINDOW_MS,
  });
}

function getAuthRedirectBaseUrl(request: Request) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL.trim()}`
      : "");

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getSupabaseErrorMessage(error: unknown) {
  const smtpConfigHint =
    "Email provider rejected the request. Check Supabase SMTP settings (server token, sender identity, host, and port).";

  const sanitizeMessage = (value: string) => {
    return value.trim() === "{}" ? smtpConfigHint : value;
  };

  if (!error) {
    return "Unknown auth error.";
  }

  if (typeof error === "string") {
    return sanitizeMessage(error);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object") {
    const serialized = (() => {
      try {
        return JSON.stringify(error);
      } catch {
        return "";
      }
    })();

    if (!serialized || serialized === "{}") {
      return smtpConfigHint;
    }

    const withMessage = error as { message?: unknown; error_description?: unknown; msg?: unknown };

    if (typeof withMessage.message === "string" && withMessage.message.trim()) {
      return sanitizeMessage(withMessage.message);
    }

    if (typeof withMessage.error_description === "string" && withMessage.error_description.trim()) {
      return sanitizeMessage(withMessage.error_description);
    }

    if (typeof withMessage.msg === "string" && withMessage.msg.trim()) {
      return sanitizeMessage(withMessage.msg);
    }

    return serialized;
  }

  return String(error);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; next?: string };
  const email = normalizeEmail(body.email);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const db = getCloudflareDatabase();

  if (db) {
    await ensureThrottleTable(db);
    await maybeCleanupExpiredD1(db);
  }

  const emailCheck = db
    ? await checkAndConsumeThrottleD1(db, THROTTLE_KIND_EMAIL, email, now)
    : checkAndConsumeThrottleFallback(THROTTLE_KIND_EMAIL, email, now);

  if (!emailCheck.allowed) {
    return NextResponse.json(
      {
        error: "Please wait before requesting another login email.",
        retryAfter: emailCheck.retryAfter,
      },
      { status: 429 }
    );
  }

  const ipCheck = db
    ? await checkAndConsumeThrottleD1(db, THROTTLE_KIND_IP, ip, now)
    : checkAndConsumeThrottleFallback(THROTTLE_KIND_IP, ip, now);

  if (!ipCheck.allowed) {
    return NextResponse.json(
      {
        error: "Please wait before requesting another login email.",
        retryAfter: ipCheck.retryAfter,
      },
      { status: 429 }
    );
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase env vars for email login." },
      { status: 500 }
    );
  }

  const nextPath = typeof body.next === "string" && body.next.startsWith("/") ? body.next : "/onboarding";
  const baseUrl = getAuthRedirectBaseUrl(request);

  // Generate token_hash-based magic link (doesn't send email)
  const { data, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${baseUrl}/auth/confirm`,
    },
  });

  if (linkError || !data?.properties?.action_link) {
    const errorMessage = linkError?.message || "Failed to generate magic link";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Extract token_hash from action_link URL
  const actionLinkUrl = new URL(data.properties.action_link);
  const tokenHash = actionLinkUrl.searchParams.get("token_hash");

  if (!tokenHash) {
    return NextResponse.json({ error: "Failed to extract token from magic link" }, { status: 400 });
  }

  // Send email via Resend with custom token_hash link
  const { sendMagicLinkEmail } = await import("@/lib/email");
  const emailResult = await sendMagicLinkEmail(email, tokenHash, baseUrl);

  if (!emailResult.success) {
    return NextResponse.json({ error: emailResult.error || "Failed to send email" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Magic link sent to your email. Check your inbox.",
    requestsAllowedPerWindow: MAX_REQUESTS_PER_WINDOW,
    windowSeconds: WINDOW_SECONDS,
  });
}
