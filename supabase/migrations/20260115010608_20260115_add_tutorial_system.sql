/*
  # Add Tutorial System

  1. New Tables
    - `tutorial_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `current_step` (integer, paso actual del tutorial)
      - `is_completed` (boolean, si completó el tutorial)
      - `skipped` (boolean, si saltó el tutorial)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Changes to Existing Tables
    - Add `tutorial_completed` (boolean, default false) to coach_profiles for quick lookup

  3. Security
    - Enable RLS on `tutorial_progress` table
    - Add policy for users to read/write own tutorial progress
*/

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

CREATE POLICY "Users can read own tutorial progress"
  ON tutorial_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tutorial progress"
  ON tutorial_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own tutorial progress"
  ON tutorial_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coach_profiles' AND column_name = 'tutorial_completed'
  ) THEN
    ALTER TABLE coach_profiles ADD COLUMN tutorial_completed boolean DEFAULT false;
  END IF;
END $$;
