import { getCloudflareContext } from "@opennextjs/cloudflare";
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
    console.error("[Account] Cloudflare context unavailable", error);
    return null;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * GET /api/Account
 * Returns current Founder Program statistics.
 */
export async function GET() {
  const db = await getDb();

  if (!db) {
    return NextResponse.json(
      {
        foundersClaimed: 0,
        foundersLimit: FOUNDERS_LIMIT,
        foundersRemaining: FOUNDERS_LIMIT,
        progress: 0,
      },
      { status: 200 }
    );
  }

  try {
    const row = await db
      .prepare("SELECT COUNT(*) AS total FROM Account")
      .first<{ total: number }>();

    const foundersClaimed = Number(row?.total ?? 0);

    return NextResponse.json({
      foundersClaimed,
      foundersLimit: FOUNDERS_LIMIT,
      foundersRemaining: Math.max(
        0,
        FOUNDERS_LIMIT - foundersClaimed
      ),
      progress: Math.min(
        100,
        (foundersClaimed / FOUNDERS_LIMIT) * 100
      ),
    });
  } catch (error) {
    console.error("[Account] GET failed", error);

    return NextResponse.json(
      { error: "Unable to load Founder statistics." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/Account
 * Reserve a Founder Badge.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const email =
    typeof body?.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const db = await getDb();

  if (!db) {
    return NextResponse.json(
      {
        error:
          "Founder reservations are temporarily unavailable in this local mode.",
      },
      { status: 503 }
    );
  }

  try {
    // Has this email already joined?
    const existing = await db
      .prepare("SELECT id FROM Account WHERE email = ?")
      .bind(email)
      .first();

    // Current founder count
    const row = await db
      .prepare("SELECT COUNT(*) AS total FROM Account")
      .first<{ total: number }>();

    const foundersClaimed = Number(row?.total ?? 0);

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "🔥 You're already part of the Founders Program.",
        founderNumber: null,
        isFounder: foundersClaimed <= FOUNDERS_LIMIT,
        foundersClaimed,
        foundersLimit: FOUNDERS_LIMIT,
        foundersRemaining: Math.max(
          0,
          FOUNDERS_LIMIT - foundersClaimed
        ),
        progress: Math.min(
          100,
          (foundersClaimed / FOUNDERS_LIMIT) * 100
        ),
      });
    }

    const founderNumber = foundersClaimed + 1;
    const isFounder = founderNumber <= FOUNDERS_LIMIT;

    await db
      .prepare(
        `
        INSERT INTO Account
        (
          email,
          source,
          status,
          is_founder
        )
        VALUES
        (?, ?, ?, ?)
      `
      )
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

        message: isFounder
          ? "🔥 Welcome, Founder. Your Founder Badge has been reserved."
          : "Welcome to RapYard.",

        founderNumber: isFounder ? founderNumber : null,

        isFounder,

        foundersClaimed: founderNumber,

        foundersLimit: FOUNDERS_LIMIT,

        foundersRemaining: Math.max(
          0,
          FOUNDERS_LIMIT - founderNumber
        ),

        progress: Math.min(
          100,
          (founderNumber / FOUNDERS_LIMIT) * 100
        ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("[Account] POST failed", error);

    return NextResponse.json(
      {
        error:
          "Unable to Create Your Account. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
