import { createClient } from "@/utils/supabase/client";

export type ChamberType = "booth" | "pit" | "yard";
export type EventType = "chamber_visit" | "recording_start" | "recording_complete" | "beat_preview" | "battle_match" | "profile_view";

export interface AnalyticsEvent {
    user_id: string;
    event_type: EventType;
    chamber?: ChamberType;
    data?: Record<string, any>;
    timestamp: string;
}

/**
 * Track a chamber visit
 */
export async function trackChamberVisit(userId: string, chamber: ChamberType): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "chamber_visit",
            chamber,
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Track recording start
 */
export async function trackRecordingStart(userId: string): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "recording_start",
            chamber: "booth",
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Track recording completion
 */
export async function trackRecordingComplete(
    userId: string,
    duration: number
): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "recording_complete",
            chamber: "booth",
            data: { duration_seconds: duration },
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Track beat preview
 */
export async function trackBeatPreview(userId: string, beatId: string): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "beat_preview",
            chamber: "yard",
            data: { beat_id: beatId },
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Track battle match
 */
export async function trackBattleMatch(
    userId: string,
    matchId: string,
    opponentId: string
): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "battle_match",
            chamber: "pit",
            data: { match_id: matchId, opponent_id: opponentId },
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Track profile view
 */
export async function trackProfileView(userId: string, profileId: string): Promise<void> {
    const supabase = createClient();

    await supabase.from("analytics_events").insert([
        {
            user_id: userId,
            event_type: "profile_view",
            data: { profile_id: profileId },
            timestamp: new Date().toISOString(),
        },
    ]);
}

/**
 * Get user engagement stats
 */
export async function getUserEngagementStats(
    userId: string
): Promise<{
    total_chamber_visits: number;
    total_recordings: number;
    total_battles: number;
    most_visited_chamber: ChamberType | null;
    last_activity: string | null;
}> {
    const supabase = createClient();

    const { data: events } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

    if (!events) {
        return {
            total_chamber_visits: 0,
            total_recordings: 0,
            total_battles: 0,
            most_visited_chamber: null,
            last_activity: null,
        };
    }

    const chamberVisits = events.filter((e) => e.event_type === "chamber_visit");
    const recordings = events.filter((e) => e.event_type === "recording_complete");
    const battles = events.filter((e) => e.event_type === "battle_match");

    // Find most visited chamber
    const chamberCounts = chamberVisits.reduce(
        (acc, e) => {
            acc[e.chamber] = (acc[e.chamber] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const mostVisited = Object.entries(chamberCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0];

    return {
        total_chamber_visits: chamberVisits.length,
        total_recordings: recordings.length,
        total_battles: battles.length,
        most_visited_chamber: mostVisited?.[0] as ChamberType | null,
        last_activity: events[0]?.timestamp || null,
    };
}

/**
 * Get chamber usage stats (for admin dashboard)
 */
export async function getChamberUsageStats(): Promise<{
    chamber: ChamberType;
    visits: number;
    unique_users: number;
    average_session_duration: number;
}[]> {
    const supabase = createClient();

    const { data: events } = await supabase
        .from("analytics_events")
        .select("*")
        .eq("event_type", "chamber_visit");

    if (!events) return [];

    const chambers: Record<string, Set<string>> = {
        booth: new Set(),
        pit: new Set(),
        yard: new Set(),
    };

    const chamberCounts: Record<string, number> = {
        booth: 0,
        pit: 0,
        yard: 0,
    };

    events.forEach((e) => {
        if (e.chamber) {
            chamberCounts[e.chamber]++;
            chambers[e.chamber].add(e.user_id);
        }
    });

    return Object.entries(chamberCounts).map(([chamber, count]) => ({
        chamber: chamber as ChamberType,
        visits: count,
        unique_users: chambers[chamber].size,
        average_session_duration: 0, // Would need additional tracking
    }));
}
