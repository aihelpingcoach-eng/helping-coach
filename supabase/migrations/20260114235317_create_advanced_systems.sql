/*
  # Advanced Coach Systems

  1. New Tables
    - `tactical_alerts`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `alert_type` (text - warning, critical, info, success)
      - `category` (text - defensive, offensive, synergy, injury, tactical)
      - `title` (text)
      - `description` (text)
      - `severity` (int - 1-4)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

    - `event_cards`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `card_type` (text - improvement, decline, tactical_conflict, chemistry, medical_alert, streak, demotivated)
      - `player_id` (uuid, nullable - if related to specific player)
      - `title` (text)
      - `narrative` (text)
      - `effect` (text)
      - `requires_decision` (boolean)
      - `is_resolved` (boolean)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)

    - `weekly_workload`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `player_id` (uuid)
      - `week_number` (int)
      - `training_load` (int)
      - `match_minutes` (int)
      - `fatigue_level` (text - optimal, light_fatigue, high_fatigue, injury_risk)
      - `recommendation` (text)
      - `created_at` (timestamptz)

    - `coach_missions`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key to coach_profiles)
      - `mission_type` (text - tactical, synergy, training, management, development)
      - `frequency` (text - daily, weekly, special)
      - `title` (text)
      - `description` (text)
      - `objective` (text)
      - `progress` (int)
      - `target` (int)
      - `reward_xp` (int)
      - `reward_description` (text)
      - `is_completed` (boolean)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

    - `coach_career`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, unique, foreign key to coach_profiles)
      - `coaching_style` (text)
      - `reputation` (int)
      - `total_xp` (int)
      - `current_rank` (text)
      - `matches_managed` (int)
      - `tactical_decisions` (int)
      - `missions_completed` (int)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Tactical Alerts Table
CREATE TABLE IF NOT EXISTS tactical_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('warning', 'critical', 'info', 'success')),
  category text NOT NULL CHECK (category IN ('defensive', 'offensive', 'synergy', 'injury', 'tactical')),
  title text NOT NULL,
  description text NOT NULL,
  severity int NOT NULL CHECK (severity BETWEEN 1 AND 4),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tactical_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tactical alerts"
  ON tactical_alerts FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own tactical alerts"
  ON tactical_alerts FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own tactical alerts"
  ON tactical_alerts FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own tactical alerts"
  ON tactical_alerts FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Event Cards Table
CREATE TABLE IF NOT EXISTS event_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('improvement', 'decline', 'tactical_conflict', 'chemistry', 'medical_alert', 'streak', 'demotivated')),
  player_id uuid,
  title text NOT NULL,
  narrative text NOT NULL,
  effect text NOT NULL,
  requires_decision boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE event_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own event cards"
  ON event_cards FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own event cards"
  ON event_cards FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own event cards"
  ON event_cards FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own event cards"
  ON event_cards FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Weekly Workload Table
CREATE TABLE IF NOT EXISTS weekly_workload (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  player_id uuid NOT NULL,
  week_number int NOT NULL,
  training_load int DEFAULT 0,
  match_minutes int DEFAULT 0,
  fatigue_level text NOT NULL CHECK (fatigue_level IN ('optimal', 'light_fatigue', 'high_fatigue', 'injury_risk')),
  recommendation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_workload ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly workload"
  ON weekly_workload FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own weekly workload"
  ON weekly_workload FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own weekly workload"
  ON weekly_workload FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own weekly workload"
  ON weekly_workload FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Coach Missions Table
CREATE TABLE IF NOT EXISTS coach_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  mission_type text NOT NULL CHECK (mission_type IN ('tactical', 'synergy', 'training', 'management', 'development')),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'special')),
  title text NOT NULL,
  description text NOT NULL,
  objective text NOT NULL,
  progress int DEFAULT 0,
  target int NOT NULL,
  reward_xp int NOT NULL,
  reward_description text NOT NULL,
  is_completed boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach missions"
  ON coach_missions FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own coach missions"
  ON coach_missions FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own coach missions"
  ON coach_missions FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own coach missions"
  ON coach_missions FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Coach Career Table
CREATE TABLE IF NOT EXISTS coach_career (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid UNIQUE REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  coaching_style text DEFAULT 'balanced',
  reputation int DEFAULT 0,
  total_xp int DEFAULT 0,
  current_rank text DEFAULT 'amateur',
  matches_managed int DEFAULT 0,
  tactical_decisions int DEFAULT 0,
  missions_completed int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coach_career ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coach career"
  ON coach_career FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own coach career"
  ON coach_career FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own coach career"
  ON coach_career FOR UPDATE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own coach career"
  ON coach_career FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tactical_alerts_coach_id ON tactical_alerts(coach_id);
CREATE INDEX IF NOT EXISTS idx_tactical_alerts_active ON tactical_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_event_cards_coach_id ON event_cards(coach_id);
CREATE INDEX IF NOT EXISTS idx_event_cards_resolved ON event_cards(is_resolved);
CREATE INDEX IF NOT EXISTS idx_weekly_workload_coach_id ON weekly_workload(coach_id);
CREATE INDEX IF NOT EXISTS idx_weekly_workload_player_id ON weekly_workload(player_id);
CREATE INDEX IF NOT EXISTS idx_coach_missions_coach_id ON coach_missions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_missions_completed ON coach_missions(is_completed);
CREATE INDEX IF NOT EXISTS idx_coach_career_coach_id ON coach_career(coach_id);
