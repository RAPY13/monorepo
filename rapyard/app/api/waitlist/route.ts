import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const FOUNDERS_LIMIT = 500;

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function getFounderStats(supabase: SupabaseClient) {
  const { count, error } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true })
    .eq("is_founder", true);

  if (error) {
    throw error;
  }

  const foundersClaimed = Number(count ?? 0);
  const foundersRemaining = Math.max(FOUNDERS_LIMIT - foundersClaimed, 0);
  const progress = Math.min(Math.round((foundersClaimed / FOUNDERS_LIMIT) * 100), 100);

  return {
    foundersClaimed,
    foundersLimit: FOUNDERS_LIMIT,
    foundersRemaining,
    progress,
  };
}

async function getFounderNumber(supabase: SupabaseClient, email: string) {
  const { data, error } = await supabase
    .from("waitlist")
    .select("email")
    .eq("is_founder", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Array<{ email: string | null }>;
  const index = rows.findIndex((row) => normalizeEmail(row.email) === email);
  return index >= 0 ? index + 1 : null;
}

export async function GET() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase server env vars for waitlist API." },
      { status: 500 }
    );
  }

  try {
    const stats = await getFounderStats(supabase);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { error: "Unable to load waitlist stats right now." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase server env vars for waitlist API." },
      { status: 500 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = normalizeEmail(body.email);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("waitlist").insert({
        email,
        source: "gate",
        status: "pending",
        is_founder: true,
      });

      if (insertError && insertError.code !== "23505") {
        throw insertError;
      }
    }

    const [stats, founderNumber] = await Promise.all([
      getFounderStats(supabase),
      getFounderNumber(supabase, email),
    ]);

    return NextResponse.json({
      success: true,
      alreadyJoined: Boolean(existing),
      founderNumber,
      ...stats,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reserve your Founder Badge right now." },
      { status: 500 }
    );
  }
}
