-- Battle Matches Table
CREATE TABLE IF NOT EXISTS battle_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  challenger_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  
  CONSTRAINT different_users CHECK (challenger_id != opponent_id),
  INDEX idx_challenger_id (challenger_id),
  INDEX idx_opponent_id (opponent_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
);

-- User Ratings Table
CREATE TABLE IF NOT EXISTS user_ratings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  elo INTEGER DEFAULT 1000,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_battles INTEGER DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_elo (elo DESC)
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  chamber TEXT CHECK (chamber IN ('booth', 'pit', 'yard') OR chamber IS NULL),
  data JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_event_type (event_type),
  INDEX idx_chamber (chamber),
  INDEX idx_timestamp (timestamp DESC)
);

-- Enable RLS on all tables
ALTER TABLE battle_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Battle Matches RLS Policies
CREATE POLICY "Users can view battles they're part of"
  ON battle_matches
  FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

CREATE POLICY "Users can create battles"
  ON battle_matches
  FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update battles they're part of"
  ON battle_matches
  FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id)
  WITH CHECK (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- User Ratings RLS Policies
CREATE POLICY "Users can view all ratings (leaderboard)"
  ON user_ratings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own ratings"
  ON user_ratings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analytics Events RLS Policies
CREATE POLICY "Users can insert own events"
  ON analytics_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics"
  ON analytics_events
  FOR SELECT
  USING (auth.uid() = user_id);
