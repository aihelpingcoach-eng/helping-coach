/*
  # Add Progression System to Coach Profiles

  ## Overview
  This migration adds a comprehensive progression system to track coach evolution,
  including ranks, experience points (XP), and unlocked features.

  ## 1. Changes to Tables
    - `coach_profiles` - Add new columns:
      - `rank` (text) - Current rank of the coach
      - `total_xp` (integer) - Total experience points accumulated
      - `current_rank_xp` (integer) - XP within current rank
      - `unlocked_features` (jsonb) - Array of unlocked features/content

  ## 2. Default Values
    - New users start at "Aspirante" rank with 0 XP
    - Basic features are unlocked by default

  ## 3. Important Notes
    - Ranks follow a progression system from Aspirante to Legendario
    - XP is gained through various activities (creating lineups, training, etc.)
    - Features are unlocked progressively as rank increases
    - The system motivates continued engagement and rewards active coaches
*/

-- Add progression columns to coach_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_profiles' AND column_name = 'rank'
  ) THEN
    ALTER TABLE coach_profiles ADD COLUMN rank text DEFAULT 'Aspirante';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_profiles' AND column_name = 'total_xp'
  ) THEN
    ALTER TABLE coach_profiles ADD COLUMN total_xp integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_profiles' AND column_name = 'current_rank_xp'
  ) THEN
    ALTER TABLE coach_profiles ADD COLUMN current_rank_xp integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_profiles' AND column_name = 'unlocked_features'
  ) THEN
    ALTER TABLE coach_profiles ADD COLUMN unlocked_features jsonb DEFAULT '["basic_formations", "basic_playstyles"]'::jsonb;
  END IF;
END $$;

-- Create index for faster rank lookups
CREATE INDEX IF NOT EXISTS idx_coach_profiles_rank ON coach_profiles(rank);
CREATE INDEX IF NOT EXISTS idx_coach_profiles_total_xp ON coach_profiles(total_xp);