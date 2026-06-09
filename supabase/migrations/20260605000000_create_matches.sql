/*
  # Tabla de partidos — Helping Coach
  Ejecutar en Supabase SQL Editor.
*/

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opponent text NOT NULL,
  date date NOT NULL,
  time text DEFAULT '',
  location text DEFAULT '',
  competition text DEFAULT 'Liga',
  result text CHECK (result IN ('win', 'draw', 'loss')),
  score_for integer,
  score_against integer,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_matches_select" ON matches;
DROP POLICY IF EXISTS "own_matches_insert" ON matches;
DROP POLICY IF EXISTS "own_matches_update" ON matches;
DROP POLICY IF EXISTS "own_matches_delete" ON matches;

CREATE POLICY "own_matches_select" ON matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_matches_insert" ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_matches_update" ON matches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_matches_delete" ON matches FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_matches_user_date ON matches(user_id, date DESC);
