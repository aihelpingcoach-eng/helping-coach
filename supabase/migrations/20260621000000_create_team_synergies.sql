/*
  # Crear tabla team_synergies

  1. Nueva tabla
    - `team_synergies`
      - `id` (uuid, primary key)
      - `coach_id` (uuid, foreign key a coach_profiles)
      - `formation_type` (text)
      - `cache_key` (text - hash determinista de jugadores+posiciones+playstyles)
      - `synergies` (jsonb - resultado del análisis de IA)
      - `created_at` (timestamptz)

  2. Seguridad
    - RLS habilitado
    - Los coaches solo pueden ver/crear/actualizar sus propias sinergias

  3. Propósito
    - Persistir el resultado del análisis de sinergias de IA para que no
      cambie entre recargas de página ni entre clics repetidos del mismo
      equipo/formación (la IA no es perfectamente determinista).
*/

CREATE TABLE IF NOT EXISTS team_synergies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid REFERENCES coach_profiles(id) ON DELETE CASCADE NOT NULL,
  formation_type text NOT NULL,
  cache_key text NOT NULL,
  synergies jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_synergies_lookup
  ON team_synergies (coach_id, formation_type, cache_key);

ALTER TABLE team_synergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own team synergies"
  ON team_synergies FOR SELECT
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own team synergies"
  ON team_synergies FOR INSERT
  TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own team synergies"
  ON team_synergies FOR DELETE
  TO authenticated
  USING (coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));
