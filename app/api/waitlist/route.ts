#import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

const FOUNDERS_LIMIT = 500;

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
  } catch (error) {
    console.error("[waitlist] Cloudflare context unavailable", error);
    return null;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function founderStats(count: number) {
  return {
    foundersClaimed: count,
    foundersLimit: FOUNDERS_LIMIT,
    foundersRemaining: Math.max(0, FOUNDERS_LIMIT - count),
    progress: Math.min(100, (count / FOUNDERS_LIMIT) * 100),
  };
}

/**
 * GET /api/waitlist
 * Returns current Founder Program statistics.
 */
export async function GET() {
  const db = await getDb();

  if (!db) {
    return NextResponse.json(founderStats(0));
  }

  try {
    const row = await db
      .prepare("SELECT COUNT(*) AS total FROM waitlist")
      .first<{ total: number }>();

    const foundersClaimed = Number(row?.total ?? 0);

    return NextResponse.json(founderStats(foundersClaimed), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("[waitlist] GET failed", error);

    return NextResponse.json(
      {
        error: "Unable to load Founder statistics.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/waitlist
 * Reserve a Founder Badge.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  const email =
    typeof (body as { email?: unknown }).email === "string"
      ? (body as { email: string }).email.trim().toLowerCase()
      : "";

  if (!email) {
    return NextResponse.json(
      {
        error: "Email is required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        error: "Please enter a valid email address.",
      },
      {
        status: 400,
      }
    );
  }

  const db = await getDb();

  if (!db) {
    return NextResponse.json(
      {
        error:
          "Founder reservations are temporarily unavailable in this local mode.",
      },
      {
        status: 503,
      }
    );
  }

  try {
    const existing = await db
      .prepare("SELECT id FROM waitlist WHERE email = ?")
      .bind(email)
      .first();

    const row = await db
      .prepare("SELECT COUNT(*) AS total FROM waitlist")
      .first<{ total: number }>();

    const foundersClaimed = Number(row?.total ?? 0);

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "🔥 You're already part of the Founders Program.",
        founderNumber: null,
        isFounder: foundersClaimed <= FOUNDERS_LIMIT,
        ...founderStats(foundersClaimed),
      });
    }

    const founderNumber = foundersClaimed + 1;
    const isFounder = founderNumber <= FOUNDERS_LIMIT;

    await db
      .prepare(`
        INSERT INTO waitlist
        (
          email,
          source,
          status,
          is_founder
        )
        VALUES
        (?, ?, ?, ?)
      `)
      .bind(
        email,
        "gate",
        "pending",
        isFounder ? 1 : 0
      )
      .run();

    return NextResponse.json(
      {
        success: true,
       message: "Welcome, Founder. Your Founder Badge has been reserved."
          : "Welcome to RapYard.",
        founderNumber: isFounder ? founderNumber : null,
        isFounder,
        ...founderStats(founderNumber),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("[waitlist] POST failed", error);

    const message =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (
      message.includes("unique") ||
      message.includes("constraint")
    ) {
      return NextResponse.json({
  success: true,
  alreadyJoined: true,
  message: "You're already part of the Founders Program.",
  founderNumber: null,
  isFounder: foundersClaimed <= FOUNDERS_LIMIT,
  ...founderStats(foundersClaimed),
});
    }

    return NextResponse.json(
      {
        error:
          "Unable to reserve your Founder Badge. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
