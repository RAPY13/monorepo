export type BattleStatus = "upcoming" | "live" | "ended";

export type Battle = {
  id: string;
  title: string;
  status: BattleStatus;
  participants: string[];
  votes: Record<string, number>;
  created_at: string;
};
