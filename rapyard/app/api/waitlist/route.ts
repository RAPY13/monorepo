import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

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
