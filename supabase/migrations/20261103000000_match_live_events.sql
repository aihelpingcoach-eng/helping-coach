/*
  # Directo de partido

  1. match_events: cada acción apuntada durante el partido (gol, tiro, córner,
     saque de banda, falta, fuera de juego, tarjetas y cambios) de los dos
     equipos, con su minuto y su parte. El id lo genera la app para poder
     guardar sin conexión y subirlo después sin duplicar (upsert).
  2. matches.live_state: estado del directo (parte, cronómetro, duración de
     cada parte, equipo y once inicial). Permite retomar el partido si se
     cierra la app y calcular los minutos jugados (pestaña Carga de Avanzado).
*/

CREATE TABLE IF NOT EXISTS match_events (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team text NOT NULL CHECK (team IN ('own', 'rival')),
  event_type text NOT NULL CHECK (event_type IN (
    'goal', 'shot_on', 'shot_off', 'corner', 'throw_in', 'foul', 'offside', 'yellow', 'red', 'sub'
  )),
  player_id uuid REFERENCES players(id) ON DELETE SET NULL,
  player_in_id uuid REFERENCES players(id) ON DELETE SET NULL,
  minute integer NOT NULL CHECK (minute >= 0),
  period smallint NOT NULL CHECK (period IN (1, 2)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS match_events_match_id_idx ON match_events (match_id);
CREATE INDEX IF NOT EXISTS match_events_user_id_idx ON match_events (user_id);

ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own match events" ON match_events;
CREATE POLICY "Users can view own match events"
  ON match_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own match events" ON match_events;
CREATE POLICY "Users can insert own match events"
  ON match_events FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own match events" ON match_events;
CREATE POLICY "Users can update own match events"
  ON match_events FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own match events" ON match_events;
CREATE POLICY "Users can delete own match events"
  ON match_events FOR DELETE TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE matches ADD COLUMN IF NOT EXISTS live_state jsonb;
