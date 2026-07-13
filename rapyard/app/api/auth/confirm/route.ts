import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ensureProfileRow } from "@/lib/onboarding-profile";

function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
        return null;
    }

    return createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        },
    });
}

export async function POST(request: Request) {
    const body = (await request.json().catch(() => ({}))) as {
        token_hash?: string;
        type?: string;
    };

    const { token_hash, type } = body;

    if (!token_hash || type !== "email") {
        return NextResponse.json(
            { error: "Invalid or missing token_hash" },
            { status: 400 }
        );
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
        return NextResponse.json(
            { error: "Missing Supabase configuration" },
            { status: 500 }
        );
    }

    try {
        // Verify OTP with token_hash
        const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: "email",
        });

        if (error || !data.user) {
            return NextResponse.json(
                { error: error?.message || "Invalid or expired token" },
                { status: 401 }
            );
        }

        const user = data.user;

        // Ensure profile row exists
        await ensureProfileRow(supabase, user);

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                metadata: user.user_metadata,
            },
        });
    } catch (err) {
        console.error("Auth confirmation error:", err);
        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}
