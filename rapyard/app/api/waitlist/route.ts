import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = hasSupabase
  ? createClient(process.env.SUPABASE_URL ?? "", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")
  : null;

const DEV_FILE = path.join(process.cwd(), ".dev_waitlist.json");

function readDevWaitlist() {
  try {
    if (!fs.existsSync(DEV_FILE)) return [];
    const raw = fs.readFileSync(DEV_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeDevWaitlist(list: any[]) {
  try {
    fs.writeFileSync(DEV_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    // ignore
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (supabase) {
    const { count, error: countError } = await supabase
      .from("waitlist")
      .select("id", { head: true, count: "exact" });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    const isFounder = (count ?? 0) < 500;

    const { data: existing, error: fetchError } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { message: "You are already on the waitlist.", alreadyJoined: true, isFounder },
        { status: 200 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("waitlist")
      .insert({ email, source: "gate", status: "pending", is_founder: isFounder })
      .select("id, email, is_founder")
      .single();

    if (insertError || !data) {
      return NextResponse.json({ error: insertError?.message || "Unable to join waitlist." }, { status: 500 });
    }

    await supabase
      .from("users")
      .upsert(
        { email, lane: "listener", is_founder: isFounder },
        { onConflict: ["email"] }
      );

    return NextResponse.json({ message: "Welcome to the waitlist.", isFounder: data.is_founder, email: data.email }, { status: 201 });
  }

  // Development fallback: persist to a local JSON file so devs can test without Supabase
  const list = readDevWaitlist();
  const already = list.find((i: any) => i.email === email);
  const isFounder = (list.length ?? 0) < 500;

  if (already) {
    return NextResponse.json({ message: "You are already on the waitlist.", alreadyJoined: true, isFounder }, { status: 200 });
  }

  const entry = { id: Date.now(), email, is_founder: isFounder, source: "gate", status: "pending" };
  list.push(entry);
  writeDevWaitlist(list);

  return NextResponse.json({ message: "(dev) Welcome to the waitlist.", isFounder: entry.is_founder, email: entry.email }, { status: 201 });
}
