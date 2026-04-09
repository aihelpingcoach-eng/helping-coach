/*
  # Add User Authentication and Data Isolation

  1. Changes
    - Add user_id column to all tables
    - Link data to authenticated users
    - Update RLS policies for user isolation
    
  2. Tables Modified
    - `players` - Add user_id column
    - `formations` - Add user_id column
    - `formation_players` - Add user_id column
    - `player_progress` - Add user_id column
    
  3. Security
    - Update RLS policies to filter by user_id
    - Ensure users can only access their own data
    - Policies for SELECT, INSERT, UPDATE, DELETE
*/

-- Add user_id column to players table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'players' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE players ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id column to formations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE formations ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id column to formation_players table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formation_players' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE formation_players ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id column to player_progress table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'player_progress' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE player_progress ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own players" ON players;
DROP POLICY IF EXISTS "Users can insert own players" ON players;
DROP POLICY IF EXISTS "Users can update own players" ON players;
DROP POLICY IF EXISTS "Users can delete own players" ON players;

DROP POLICY IF EXISTS "Users can read own formations" ON formations;
DROP POLICY IF EXISTS "Users can insert own formations" ON formations;
DROP POLICY IF EXISTS "Users can update own formations" ON formations;
DROP POLICY IF EXISTS "Users can delete own formations" ON formations;

DROP POLICY IF EXISTS "Users can read own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can insert own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can update own formation_players" ON formation_players;
DROP POLICY IF EXISTS "Users can delete own formation_players" ON formation_players;

DROP POLICY IF EXISTS "Users can read own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can insert own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can update own player_progress" ON player_progress;
DROP POLICY IF EXISTS "Users can delete own player_progress" ON player_progress;

-- Create RLS policies for players table
CREATE POLICY "Users can read own players"
  ON players FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own players"
  ON players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own players"
  ON players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own players"
  ON players FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for formations table
CREATE POLICY "Users can read own formations"
  ON formations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formations"
  ON formations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formations"
  ON formations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own formations"
  ON formations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for formation_players table
CREATE POLICY "Users can read own formation_players"
  ON formation_players FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formation_players"
  ON formation_players FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formation_players"
  ON formation_players FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own formation_players"
  ON formation_players FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for player_progress table
CREATE POLICY "Users can read own player_progress"
  ON player_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own player_progress"
  ON player_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own player_progress"
  ON player_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own player_progress"
  ON player_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
