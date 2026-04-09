/*
  # Create Coach Profiles Table

  ## Overview
  This migration creates a comprehensive coach profiles system that stores personal information,
  preferences, and configuration for each authenticated user/coach.

  ## 1. New Tables
    - `coach_profiles`
      - `id` (uuid, primary key) - Unique profile identifier
      - `user_id` (uuid, foreign key) - Links to auth.users table
      - `coach_name` (text) - Name of the coach
      - `team_name` (text) - Name of the team they manage
      - `profile_photo` (text, optional) - URL to profile photo
      - `age` (integer, optional) - Coach's age
      - `country` (text, optional) - Coach's country
      - `years_experience` (integer, optional) - Years of coaching experience
      - `coaching_style` (text) - Style: Defensivo, Ofensivo, Posesión, Contraataque, Equilibrado
      - `favorite_formation` (text) - Preferred formation (e.g., 4-3-3, 4-4-2)
      - `coach_level` (text) - Level: Amateur, Semi-profesional, Profesional, Élite
      - `team_objective` (text) - Objective: Desarrollo de jóvenes, Ganar partidos, Equilibrio
      - `language` (text) - Preferred language, default 'es'
      - `theme` (text) - Visual theme, default 'dark'
      - `created_at` (timestamptz) - Profile creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
    - Enable RLS on `coach_profiles` table
    - Add policies for authenticated users to:
      - Read their own profile
      - Update their own profile
      - Insert their own profile (one per user)
      - Delete their own profile

  ## 3. Important Notes
    - Each user can only have one coach profile (enforced by unique constraint on user_id)
    - Profile is automatically created when user signs up
    - All personal data is protected by RLS policies
    - Coaching preferences are used by AI to personalize responses
*/

-- Create coach_profiles table
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON coach_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON coach_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON coach_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON coach_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coach_profiles_user_id ON coach_profiles(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coach_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS trigger_update_coach_profiles_updated_at ON coach_profiles;
CREATE TRIGGER trigger_update_coach_profiles_updated_at
  BEFORE UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_coach_profiles_updated_at();