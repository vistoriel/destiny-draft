-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_key_hash TEXT NOT NULL UNIQUE,
  game_name TEXT NOT NULL,
  game_settings JSONB DEFAULT '{}'::jsonb
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  player_key_hash TEXT UNIQUE,
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  character_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_characters_game_id ON characters(game_id);
CREATE INDEX IF NOT EXISTS idx_characters_is_claimed ON characters(is_claimed);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games table
-- Anyone can read game info (but not the admin_key_hash)
CREATE POLICY "Games are publicly readable"
  ON games
  FOR SELECT
  USING (true);

-- RLS Policies for characters table
-- Anyone can read characters
CREATE POLICY "Characters are publicly readable"
  ON characters
  FOR SELECT
  USING (true);

-- Column-Level Security: Restrict access to hash columns
-- Revoke SELECT on sensitive hash columns from public roles
REVOKE SELECT (admin_key_hash) ON games FROM anon, authenticated;
REVOKE SELECT (player_key_hash) ON characters FROM anon, authenticated;

-- Explicitly grant to service_role (it has full access by default, but this makes it clear)
GRANT SELECT (admin_key_hash) ON games TO service_role;
GRANT SELECT (player_key_hash) ON characters TO service_role;

-- Grant SELECT on all other columns to anon role (for public access)
GRANT SELECT (id, created_at, game_name, game_settings) ON games TO anon, authenticated;
GRANT SELECT (id, game_id, player_name, is_claimed, claimed_at, character_data, created_at) ON characters TO anon, authenticated;

-- Note: INSERT, UPDATE, DELETE operations should be done via API routes
-- with service role key to bypass RLS and validate keys properly
