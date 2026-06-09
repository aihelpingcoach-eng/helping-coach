/*
  # Schema inicial completo — Helping Coach

  Ejecutar este archivo PRIMERO en Supabase SQL Editor.
  Crea todas las tablas base que las demás migraciones asumen que existen.
*/

-- ============================================================
-- TABLA: players
-- ============================================================
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  playstyle text DEFAULT '',
  playstyle_category text DEFAULT '',
  playstyle_explanation text DEFAULT '',
  position text DEFAULT '',
  level integer NOT NULL DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own players" ON players;
DROP POLICY IF EXISTS "Users can insert own players" ON players;
DROP POLICY IF EXISTS "Users can update own players" ON players;
DROP POLICY IF EXISTS "Users can delete own players" ON players;

CREATE POLICY "Users can read own players"
  ON players FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own players"
  ON players FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own players"
  ON players FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own players"
  ON players FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);

-- ============================================================
-- TABLA: formations
-- ============================================================
CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  formation_type text NOT NULL DEFAULT '4-3-3',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE formations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own formations" ON formations;
DROP POLICY IF EXISTS "Users can insert own formations" ON formations;
DROP POLICY IF EXISTS "Users can update own formations" ON formations;
DROP POLICY IF EXISTS "Users can delete own formations" ON formations;

CREATE POLICY "Users can read own formations"
  ON formations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formations"
  ON formations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formations"
  ON formations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own formations"
  ON formations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_formations_user_id ON formations(user_id);

-- ============================================================
-- TABLA: formation_players
-- ============================================================
CREATE TABLE IF NOT EXISTS formation_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  formation_id uuid NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  position_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE formation_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can insert own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can update own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can delete own formation_players" ON formation_players;

CREATE POLICY "Users can read own formation_players"
  ON formation_players FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formation_players"
  ON formation_players FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formation_players"
  ON formation_players FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own formation_players"
  ON formation_players FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_formation_players_formation_id ON formation_players(formation_id);
CREATE INDEX IF NOT EXISTS idx_formation_players_player_id ON formation_players(player_id);

-- ============================================================
-- TABLA: player_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS player_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  swipe_direction text NOT NULL CHECK (swipe_direction IN ('left', 'right')),
  level_change integer NOT NULL,
  level_after integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can insert own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can update own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can delete own player_progress" ON player_progress;

CREATE POLICY "Users can read own player_progress"
  ON player_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player_progress"
  ON player_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own player_progress"
  ON player_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own player_progress"
  ON player_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_player_progress_player_id ON player_progress(player_id);

-- ============================================================
-- TABLA: coach_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_name text NOT NULL,
  team_name text DEFAULT '',
  profile_photo text DEFAULT '',
  age integer,
  country text DEFAULT '',
  years_experience integer,
  coaching_style text DEFAULT 'Equilibrado',
  favorite_formation text DEFAULT '4-3-3',
  coach_level text DEFAULT 'Amateur',
  team_objective text DEFAULT 'Equilibrio',
  language text DEFAULT 'es',
  theme text DEFAULT 'dark',
  rank text DEFAULT 'Aspirante',
  total_xp integer DEFAULT 0,
  current_rank_xp integer DEFAULT 0,
  unlocked_features jsonb DEFAULT '["basic_formations", "basic_playstyles"]'::jsonb,
  tutorial_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON coach_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON coach_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON coach_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON coach_profiles;

CREATE POLICY "Users can view own profile"
  ON coach_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON coach_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON coach_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON coach_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_rank ON coach_profiles(rank);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_total_xp ON coach_profiles(total_xp);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_coach_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_coach_profiles_updated_at ON coach_profiles;
CREATE TRIGGER trigger_update_coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_coach_profiles_updated_at();

-- ============================================================
-- TABLA: tutorial_progress
-- ============================================================
CREATE TABLE IF NOT EXISTS tutorial_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  skipped boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tutorial_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own tutorial progress" ON tutorial_progress;
DROP POLICY IF EXISTS "Users can update own tutorial progress" ON tutorial_progress;
DROP POLICY IF EXISTS "Users can insert own tutorial progress" ON tutorial_progress;

CREATE POLICY "Users can read own tutorial progress"
  ON tutorial_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tutorial progress"
  ON tutorial_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutorial progress"
  ON tutorial_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TABLA: training_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL,
  exercise_ids uuid[] NOT NULL DEFAULT '{}',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_sessions_select" ON training_sessions;
DROP POLICY IF EXISTS "users_own_sessions_insert" ON training_sessions;
DROP POLICY IF EXISTS "users_own_sessions_update" ON training_sessions;
DROP POLICY IF EXISTS "users_own_sessions_delete" ON training_sessions;

CREATE POLICY "users_own_sessions_select" ON training_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_own_sessions_insert" ON training_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_own_sessions_update" ON training_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_own_sessions_delete" ON training_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_training_sessions_user_id ON training_sessions(user_id);
