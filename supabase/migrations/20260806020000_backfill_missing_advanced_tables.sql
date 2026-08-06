/*
  # Recuperar tablas de Avanzado que faltaban en produccion

  La migracion 20260114235317_create_advanced_systems.sql nunca llego a
  aplicarse por completo: solo `coach_missions` existia en produccion.
  Faltaban tactical_alerts, event_cards, weekly_workload y coach_career,
  lo que rompia silenciosamente las pestanas Alertas, Eventos y Carga
  de Avanzado (error "could not find the table in the schema cache").

  Esta migracion solo crea lo que falta (usa IF NOT EXISTS) y no toca
  coach_missions para no chocar con las politicas que ya existen ahi.
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

DROP POLICY IF EXISTS "Users can view own tactical alerts" ON tactical_alerts;
CREATE POLICY "Users can view own tactical alerts"
  ON tactical_alerts FOR SELECT TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own tactical alerts" ON tactical_alerts;
CREATE POLICY "Users can insert own tactical alerts"
  ON tactical_alerts FOR INSERT TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own tactical alerts" ON tactical_alerts;
CREATE POLICY "Users can update own tactical alerts"
  ON tactical_alerts FOR UPDATE TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own tactical alerts" ON tactical_alerts;
CREATE POLICY "Users can delete own tactical alerts"
  ON tactical_alerts FOR DELETE TO authenticated
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

DROP POLICY IF EXISTS "Users can view own event cards" ON event_cards;
CREATE POLICY "Users can view own event cards"
  ON event_cards FOR SELECT TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own event cards" ON event_cards;
CREATE POLICY "Users can insert own event cards"
  ON event_cards FOR INSERT TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own event cards" ON event_cards;
CREATE POLICY "Users can update own event cards"
  ON event_cards FOR UPDATE TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own event cards" ON event_cards;
CREATE POLICY "Users can delete own event cards"
  ON event_cards FOR DELETE TO authenticated
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

DROP POLICY IF EXISTS "Users can view own weekly workload" ON weekly_workload;
CREATE POLICY "Users can view own weekly workload"
  ON weekly_workload FOR SELECT TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own weekly workload" ON weekly_workload;
CREATE POLICY "Users can insert own weekly workload"
  ON weekly_workload FOR INSERT TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own weekly workload" ON weekly_workload;
CREATE POLICY "Users can update own weekly workload"
  ON weekly_workload FOR UPDATE TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own weekly workload" ON weekly_workload;
CREATE POLICY "Users can delete own weekly workload"
  ON weekly_workload FOR DELETE TO authenticated
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

DROP POLICY IF EXISTS "Users can view own coach career" ON coach_career;
CREATE POLICY "Users can view own coach career"
  ON coach_career FOR SELECT TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own coach career" ON coach_career;
CREATE POLICY "Users can insert own coach career"
  ON coach_career FOR INSERT TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own coach career" ON coach_career;
CREATE POLICY "Users can update own coach career"
  ON coach_career FOR UPDATE TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own coach career" ON coach_career;
CREATE POLICY "Users can delete own coach career"
  ON coach_career FOR DELETE TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tactical_alerts_coach_id ON tactical_alerts(coach_id);
CREATE INDEX IF NOT EXISTS idx_tactical_alerts_active ON tactical_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_event_cards_coach_id ON event_cards(coach_id);
CREATE INDEX IF NOT EXISTS idx_event_cards_resolved ON event_cards(is_resolved);
CREATE INDEX IF NOT EXISTS idx_weekly_workload_coach_id ON weekly_workload(coach_id);
CREATE INDEX IF NOT EXISTS idx_weekly_workload_player_id ON weekly_workload(player_id);
CREATE INDEX IF NOT EXISTS idx_coach_career_coach_id ON coach_career(coach_id);
