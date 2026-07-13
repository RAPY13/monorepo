import { createClient } from "@/utils/supabase/client";

export interface BattleMatch {
    id: string;
    challenger_id: string;
    opponent_id: string;
    challenger_name: string;
    opponent_name: string;
    status: "pending" | "active" | "completed";
    created_at: string;
    started_at?: string;
    ended_at?: string;
    winner_id?: string;
    challenger_score: number;
    opponent_score: number;
}

export interface UserRating {
    user_id: string;
    elo: number;
    wins: number;
    losses: number;
    total_battles: number;
}

/**
 * Find the next available opponent based on ELO rating
 * Returns a ranked list of potential opponents within ±200 ELO range
 */
export async function findOpponents(
    userId: string,
    limit: number = 5
): Promise<{ user_id: string; username: string; elo: number }[]> {
    const supabase = createClient();

    // Get current user's ELO
    const { data: userRating } = await supabase
        .from("user_ratings")
        .select("elo")
        .eq("user_id", userId)
        .single();

    if (!userRating) {
        throw new Error("User rating not found");
    }

    const userElo = userRating.elo || 1000; // Default ELO
    const eloRange = 200;

    // Find users within ELO range, excluding current user and recently battled
    const { data: opponents } = await supabase
        .from("user_ratings")
        .select("user_id, elo")
        .gt("elo", userElo - eloRange)
        .lt("elo", userElo + eloRange)
        .neq("user_id", userId)
        .order("elo", { ascending: false })
        .limit(limit);

    if (!opponents) return [];

    // Fetch user details
    const opponentIds = opponents.map((o) => o.user_id);
    const { data: users } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", opponentIds);

    return (
        opponents
            .map((opp) => ({
                user_id: opp.user_id,
                username: users?.find((u) => u.id === opp.user_id)?.username || "Anonymous",
                elo: opp.elo || 1000,
            }))
            .sort((a, b) => Math.abs(b.elo - userElo) - Math.abs(a.elo - userElo)) // Sort by closest ELO
    );
}

/**
 * Create a battle match between two users
 */
export async function createBattleMatch(
    challengerId: string,
    opponentId: string
): Promise<BattleMatch> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("battle_matches")
        .insert([
            {
                challenger_id: challengerId,
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
    return data as BattleMatch;
}

/**
 * Start a pending battle match
 */
export async function startBattleMatch(matchId: string): Promise<BattleMatch> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("battle_matches")
        .update({
            status: "active",
            started_at: new Date().toISOString(),
        })
        .eq("id", matchId)
        .select()
        .single();

    if (error) throw error;
    return data as BattleMatch;
}

/**
 * Finalize a battle match with scores and update ELO ratings
 */
export async function completeBattleMatch(
    matchId: string,
    challengerScore: number,
    opponentScore: number
): Promise<void> {
    const supabase = createClient();

    // Get match details
    const { data: match } = await supabase
        .from("battle_matches")
        .select("*")
        .eq("id", matchId)
        .single();

    if (!match) throw new Error("Match not found");

    const winnerId = challengerScore > opponentScore ? match.challenger_id : match.opponent_id;

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
        throw new Error("User ratings not found");
    }

    const challengerRating = ratings.find((r) => r.user_id === match.challenger_id);
    const opponentRating = ratings.find((r) => r.user_id === match.opponent_id);

    // Calculate ELO change (simple formula)
    const K = 32; // ELO constant
    const challengerWin = challengerScore > opponentScore ? 1 : 0;
    const expectedChallenger =
        1 / (1 + Math.pow(10, (opponentRating.elo - challengerRating.elo) / 400));
    const eloChangeChallenger = K * (challengerWin - expectedChallenger);

    // Update ratings
    await supabase
        .from("user_ratings")
        .update({
            elo: challengerRating.elo + eloChangeChallenger,
            wins:
                challengerRating.wins + (challengerWin ? 1 : 0),
            losses:
                challengerRating.losses + (challengerWin ? 0 : 1),
            total_battles: challengerRating.total_battles + 1,
        })
        .eq("user_id", match.challenger_id);

    await supabase
        .from("user_ratings")
        .update({
            elo: opponentRating.elo - eloChangeChallenger,
            wins:
                opponentRating.wins + (challengerWin ? 0 : 1),
            losses:
                opponentRating.losses + (challengerWin ? 1 : 0),
            total_battles: opponentRating.total_battles + 1,
        })
        .eq("user_id", match.opponent_id);
}

/**
 * Get user's battle history
 */
export async function getBattleHistory(
    userId: string,
    limit: number = 10
): Promise<BattleMatch[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("battle_matches")
        .select("*")
        .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return (data || []) as BattleMatch[];
}

/**
 * Get user's battle stats
 */
export async function getUserBattleStats(userId: string): Promise<UserRating> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("user_ratings")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) throw error;
    return data as UserRating;
}
