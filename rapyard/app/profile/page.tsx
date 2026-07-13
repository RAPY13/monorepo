"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RequireRole } from "@/app/components/RequireRole";
import { useUser } from "@/hooks/useUser";
import { getBattleHistory, getUserBattleStats, type BattleMatch, type UserRating } from "@/lib/battle-matching";
import { getUserEngagementStats } from "@/lib/analytics";

interface UserStats {
  engagement: {
    total_chamber_visits: number;
    total_recordings: number;
    total_battles: number;
    most_visited_chamber: "booth" | "pit" | "yard" | null;
    last_activity: string | null;
  };
  battle: UserRating | null;
}

export default function ProfilePage() {
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const { user, loading } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [battleHistory, setBattleHistory] = useState<BattleMatch[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    gsap.from(dashboardRef.current, { opacity: 0, y: 40, duration: 0.8 });
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      setLoadingStats(true);

      // Load engagement stats
      const engagement = await getUserEngagementStats(user.id);

      // Load battle stats
      let battleStats = null;
      try {
        battleStats = await getUserBattleStats(user.id);
      } catch {
        // User might not have battle stats yet
      }

      setStats({
        engagement,
        battle: battleStats,
      });

      // Load battle history
      const history = await getBattleHistory(user.id);
      setBattleHistory(history);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Not authenticated</p>
      </div>
    );
  }

  const username = (user?.user_metadata as any)?.username || user?.email?.split("@")[0] || "Unnamed";
  const engagement = stats?.engagement;
  const battle = stats?.battle;

  return (
    <RequireRole>
      <div
        ref={dashboardRef}
        className="min-h-screen bg-black text-white p-10 pb-20"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-2xl font-black">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-black mb-1">{username}</h1>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
              {/* Battle Stats */}
              <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">ELO RATING</p>
                <p className="text-3xl font-black text-yellow-500">
                  {battle?.elo || "—"}
                </p>
              </div>

              {/* Win Rate */}
              <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">WIN RATE</p>
                <p className="text-3xl font-black text-green-500">
                  {battle && battle.total_battles > 0
                    ? `${Math.round((battle.wins / battle.total_battles) * 100)}%`
                    : "—"}
                </p>
              </div>

              {/* Total Battles */}
              <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">BATTLES</p>
                <p className="text-3xl font-black text-blue-500">
                  {battle?.total_battles || "0"}
                </p>
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          {engagement && (
            <div className="mb-12">
              <h2 className="text-2xl font-black mb-6 tracking-wide">ACTIVITY SUMMARY</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">BOOTH VISITS</p>
                  <p className="text-2xl font-black text-red-500">
                    {engagement.total_recordings}
                  </p>
                </div>

                <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">YARD VISITS</p>
                  <p className="text-2xl font-black text-yellow-500">
                    {engagement.total_chamber_visits}
                  </p>
                </div>

                <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">BATTLES</p>
                  <p className="text-2xl font-black text-blue-500">
                    {engagement.total_battles}
                  </p>
                </div>

                <div className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 tracking-[0.2em] mb-2">FAVORITE</p>
                  <p className="text-2xl font-black text-purple-500 uppercase">
                    {engagement.most_visited_chamber || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Battles */}
          {battleHistory.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-black mb-6 tracking-wide">RECENT BATTLES</h2>
              <div className="space-y-3">
                {battleHistory.slice(0, 5).map((battle) => {
                  const isWin = battle.winner_id === user.id;
                  return (
                    <div
                      key={battle.id}
                      className="border border-gray-700 rounded-lg p-4 bg-black/40 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white mb-1">
                            {battle.challenger_id === user.id
                              ? `vs ${battle.opponent_name}`
                              : `vs ${battle.challenger_name}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(battle.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-black ${battle.status === "completed"
                              ? isWin
                                ? "text-green-500"
                                : "text-red-500"
                              : "text-gray-400"
                              }`}
                          >
                            {battle.challenger_id === user.id
                              ? battle.challenger_score
                              : battle.opponent_score}
                            {" : "}
                            {battle.challenger_id === user.id
                              ? battle.opponent_score
                              : battle.challenger_score}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-[0.1em]">
                            {battle.status === "completed"
                              ? isWin
                                ? "WIN"
                                : "LOSS"
                              : battle.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {battleHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No battles yet. Head to the Pit to start competing.</p>
            </div>
          )}

          {/* Last Activity */}
          {engagement?.last_activity && (
            <div className="text-center text-xs text-gray-600 mt-12">
              <p>Last activity: {new Date(engagement.last_activity).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </RequireRole>
  );
}
