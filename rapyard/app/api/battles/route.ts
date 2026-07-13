import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/battles/find-opponent - Find suitable opponent for battle
 * POST /api/battles/create - Create a battle match
 * POST /api/battles/start/:id - Start a pending battle
 * POST /api/battles/complete - Complete a battle with scores
 */

export async function POST(req: NextRequest) {
    const supabase = createClient();

    try {
        const {
            action,
            userId,
            opponentId,
            matchId,
            challengerScore,
            opponentScore,
        } = await req.json();

        // Get current user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (action === "find-opponent") {
            // Find potential opponents based on ELO rating
            const { data: userRating } = await supabase
                .from("user_ratings")
                .select("elo")
                .eq("user_id", user.id)
                .single();

            const userElo = userRating?.elo || 1000;
            const eloRange = 200;

            const { data: opponents } = await supabase
                .from("user_ratings")
                .select("user_id, elo")
                .gt("elo", userElo - eloRange)
                .lt("elo", userElo + eloRange)
                .neq("user_id", user.id)
                .order("elo", { ascending: false })
                .limit(5);

            if (!opponents) {
                return NextResponse.json({ opponents: [] });
            }

            // Fetch user details
            const opponentIds = opponents.map((o) => o.user_id);
            const { data: users } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", opponentIds);

            const result = opponents.map((opp) => ({
                user_id: opp.user_id,
                username:
                    users?.find((u) => u.id === opp.user_id)?.username || "Anonymous",
                elo: opp.elo || 1000,
            }));

            return NextResponse.json({ opponents: result });
        }

        if (action === "create") {
            // Create a battle match
            if (!opponentId) {
                return NextResponse.json(
                    { error: "opponentId required" },
                    { status: 400 }
                );
            }

            const { data: match, error } = await supabase
                .from("battle_matches")
                .insert([
                    {
                        challenger_id: user.id,
                        opponent_id: opponentId,
                        status: "pending",
                        challenger_score: 0,
                        opponent_score: 0,
                        created_at: new Date().toISOString(),
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json(match);
        }

        if (action === "start") {
            // Start a pending battle
            if (!matchId) {
                return NextResponse.json(
                    { error: "matchId required" },
                    { status: 400 }
                );
            }

            const { data: match, error } = await supabase
                .from("battle_matches")
                .update({
                    status: "active",
                    started_at: new Date().toISOString(),
                })
                .eq("id", matchId)
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json(match);
        }

        if (action === "complete") {
            // Complete a battle match with scores
            if (!matchId || challengerScore === undefined || opponentScore === undefined) {
                return NextResponse.json(
                    { error: "matchId, challengerScore, opponentScore required" },
                    { status: 400 }
                );
            }

            // Get match details
            const { data: match } = await supabase
                .from("battle_matches")
                .select("*")
                .eq("id", matchId)
                .single();

            if (!match) {
                return NextResponse.json({ error: "Match not found" }, { status: 404 });
            }

            const winnerId =
                challengerScore > opponentScore
                    ? match.challenger_id
                    : match.opponent_id;

            // Update match status
            await supabase
                .from("battle_matches")
                .update({
                    status: "completed",
                    ended_at: new Date().toISOString(),
                    challenger_score: challengerScore,
                    opponent_score: opponentScore,
                    winner_id: winnerId,
                })
                .eq("id", matchId);

            // Update ELO ratings
            const { data: ratings } = await supabase
                .from("user_ratings")
                .select("*")
                .in("user_id", [match.challenger_id, match.opponent_id]);

            if (!ratings || ratings.length !== 2) {
                return NextResponse.json(
                    { error: "User ratings not found" },
                    { status: 404 }
                );
            }

            const challengerRating = ratings.find(
                (r) => r.user_id === match.challenger_id
            );
            const opponentRating = ratings.find(
                (r) => r.user_id === match.opponent_id
            );

            // Calculate ELO change (simple formula)
            const K = 32; // ELO constant
            const challengerWin = challengerScore > opponentScore ? 1 : 0;
            const expectedChallenger =
                1 /
                (1 +
                    Math.pow(
                        10,
                        (opponentRating.elo - challengerRating.elo) / 400
                    ));
            const eloChangeChallenger = K * (challengerWin - expectedChallenger);

            // Update ratings
            await supabase
                .from("user_ratings")
                .update({
                    elo: challengerRating.elo + eloChangeChallenger,
                    wins: challengerRating.wins + (challengerWin ? 1 : 0),
                    losses: challengerRating.losses + (challengerWin ? 0 : 1),
                    total_battles: challengerRating.total_battles + 1,
                })
                .eq("user_id", match.challenger_id);

            await supabase
                .from("user_ratings")
                .update({
                    elo: opponentRating.elo - eloChangeChallenger,
                    wins: opponentRating.wins + (challengerWin ? 0 : 1),
                    losses: opponentRating.losses + (challengerWin ? 1 : 0),
                    total_battles: opponentRating.total_battles + 1,
                })
                .eq("user_id", match.opponent_id);

            return NextResponse.json({
                success: true,
                match,
                eloChange: eloChangeChallenger,
            });
        }

        return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Battle API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
