import { NextResponse } from "next/server";

const THROTTLE_TABLE = "auth_email_throttle";

type D1Row = Record<string, unknown>;

type D1PreparedStatementLike = {
  bind: (...args: unknown[]) => {
    first: <T = D1Row>() => Promise<T | null>;
    all: <T = D1Row>() => Promise<{ results?: T[] }>;
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

function getCloudflareDatabase() {
  const key = Symbol.for("__cloudflare-context__");
  const context = (globalThis as Record<symbol, unknown>)[key] as CloudflareContextLike | undefined;
  return context?.env?.DB ?? null;
}

function getAdminSecret() {
  return process.env.AUTH_THROTTLE_ADMIN_KEY?.trim() || "";
}

function getProvidedSecret(request: Request) {
  const bearer = request.headers.get("authorization") || "";
  if (bearer.toLowerCase().startsWith("bearer ")) {
    return bearer.slice(7).trim();
  }

  return request.headers.get("x-throttle-admin-key")?.trim() || "";
}

function unauthorized(message: string, status = 401) {
  return NextResponse.json({ error: message }, { status });
}

async function ensureThrottleTable(db: D1DatabaseLike) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS ${THROTTLE_TABLE} (
        kind TEXT NOT NULL,
        throttle_key TEXT NOT NULL,
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
}

function maskEmail(raw: string) {
  const [localPart, domainPart] = raw.split("@");
  const local = localPart || "";
  const domain = domainPart || "";

  const localPrefix = local.slice(0, 2);
  const maskedLocal = `${localPrefix}${local.length > 2 ? "***" : "*"}`;

  const [domainName, domainTld] = domain.split(".");
  const domainPrefix = (domainName || "").slice(0, 1);
  const maskedDomainName = `${domainPrefix}${domainName && domainName.length > 1 ? "***" : "*"}`;

  if (!domainTld) {
    return `${maskedLocal}@${maskedDomainName}`;
  }

  return `${maskedLocal}@${maskedDomainName}.${domainTld}`;
}

function maskIp(raw: string) {
  if (raw.includes(":")) {
    const parts = raw.split(":");
    return `${parts.slice(0, 2).join(":")}:****`;
  }

  const parts = raw.split(".");
  if (parts.length !== 4) {
    return "***";
  }

  return `${parts[0]}.${parts[1]}.*.*`;
}

function maskThrottleKey(kind: string, key: string) {
  if (kind === "email") {
    return maskEmail(key);
  }

  if (kind === "ip") {
    return maskIp(key);
  }

  return "***";
}

function parseBoolean(value: string | null) {
  return value === "1" || value === "true";
}

function parseLimit(value: string | null) {
  const parsed = Number(value ?? 20);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }

  return Math.min(Math.floor(parsed), 200);
}

function requireAdmin(request: Request) {
  const adminSecret = getAdminSecret();
  if (!adminSecret) {
    return unauthorized("Admin key is not configured.", 503);
  }

  const providedSecret = getProvidedSecret(request);
  if (!providedSecret || providedSecret !== adminSecret) {
    return unauthorized("Unauthorized.");
  }

  return null;
}

export async function GET(request: Request) {
  const authError = requireAdmin(request);
  if (authError) {
    return authError;
  }

  const db = getCloudflareDatabase();
  if (!db) {
    return NextResponse.json({ error: "D1 binding is unavailable." }, { status: 500 });
  }

  await ensureThrottleTable(db);

  const url = new URL(request.url);
  const includeKeys = parseBoolean(url.searchParams.get("includeKeys"));
  const limit = parseLimit(url.searchParams.get("limit"));
  const now = Date.now();

  const aggregate = await db
    .prepare(
      `SELECT kind, COUNT(*) AS active_count, MIN(blocked_until_ms) AS min_until, MAX(blocked_until_ms) AS max_until
       FROM ${THROTTLE_TABLE}
       WHERE blocked_until_ms > ?1
       GROUP BY kind
       ORDER BY kind ASC`
    )
    .bind(now)
    .all<{
      kind?: string;
      active_count?: number;
      min_until?: number;
      max_until?: number;
    }>();

  const activeRows = aggregate.results ?? [];
  const summary = activeRows.map((row) => ({
    kind: String(row.kind ?? "unknown"),
    activeCount: Number(row.active_count ?? 0),
    minBlockedUntilMs: Number(row.min_until ?? 0),
    maxBlockedUntilMs: Number(row.max_until ?? 0),
  }));

  const totalActive = summary.reduce((sum, row) => sum + row.activeCount, 0);

  let entries: Array<{ kind: string; keyMasked: string; blockedUntilMs: number }> = [];

  if (includeKeys) {
    const listed = await db
      .prepare(
        `SELECT kind, throttle_key, blocked_until_ms
         FROM ${THROTTLE_TABLE}
         WHERE blocked_until_ms > ?1
         ORDER BY blocked_until_ms DESC
         LIMIT ?2`
      )
      .bind(now, limit)
      .all<{ kind?: string; throttle_key?: string; blocked_until_ms?: number }>();

    entries = (listed.results ?? []).map((row) => {
      const kind = String(row.kind ?? "unknown");
      const key = String(row.throttle_key ?? "");

      return {
        kind,
        keyMasked: maskThrottleKey(kind, key),
        blockedUntilMs: Number(row.blocked_until_ms ?? 0),
      };
    });
  }

  return NextResponse.json({
    totalActive,
    summary,
    entries,
  });
}

export async function DELETE(request: Request) {
  const authError = requireAdmin(request);
  if (authError) {
    return authError;
  }

  const db = getCloudflareDatabase();
  if (!db) {
    return NextResponse.json({ error: "D1 binding is unavailable." }, { status: 500 });
  }

  await ensureThrottleTable(db);

  const now = Date.now();

  const expiredCountRow = await db
    .prepare(`SELECT COUNT(*) AS c FROM ${THROTTLE_TABLE} WHERE blocked_until_ms <= ?1`)
    .bind(now)
    .first<{ c?: number }>();

  const expiredBefore = Number(expiredCountRow?.c ?? 0);

  await db
    .prepare(`DELETE FROM ${THROTTLE_TABLE} WHERE blocked_until_ms <= ?1`)
    .bind(now)
    .run();

  return NextResponse.json({
    removed: expiredBefore,
    now,
  });
}
