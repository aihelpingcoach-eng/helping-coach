/*
  # Clasificación: privacidad y ranking semanal

  1. Aparecer en la clasificación pasa a ser opcional (columna show_in_ranking,
     visible por defecto; se desactiva desde Perfil) y la edad deja de ser
     pública: se quita de la vista coach_rankings.
  2. Historial de XP (xp_events) para poder hacer una clasificación semanal.
     Lo rellena un trigger cada vez que sube total_xp en coach_profiles, así
     que no depende del código que da la XP. Los clientes no pueden escribir
     en la tabla (sin política de INSERT); solo leen lo suyo.
  3. Vista coach_rankings_weekly: XP ganada desde el lunes a las 00:00 (hora
     de Madrid) por cada entrenador visible.

  Compatible con la versión anterior de la app: la vista conserva todas las
  columnas salvo age, y el modal de perfil ya la trataba como opcional.
*/

-- ══════════════════════════════════════════════════════════
-- 1) Privacidad
-- ══════════════════════════════════════════════════════════
ALTER TABLE coach_profiles
  ADD COLUMN IF NOT EXISTS show_in_ranking boolean NOT NULL DEFAULT true;

-- CREATE OR REPLACE no permite quitar columnas (age): hay que recrearla.
DROP VIEW IF EXISTS coach_rankings;
CREATE VIEW coach_rankings AS
SELECT
  user_id,
  coach_name,
  team_name,
  profile_photo,
  total_xp,
  rank,
  created_at,
  country,
  years_experience,
  coaching_style,
  favorite_formation,
  coach_level,
  team_objective
FROM coach_profiles
WHERE show_in_ranking
ORDER BY total_xp DESC;

GRANT SELECT ON coach_rankings TO authenticated;

-- ══════════════════════════════════════════════════════════
-- 2) Historial de XP
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS xp_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS xp_events_created_at_idx ON xp_events (created_at);
CREATE INDEX IF NOT EXISTS xp_events_user_id_idx ON xp_events (user_id);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own xp events" ON xp_events;
CREATE POLICY "Users can view own xp events"
  ON xp_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION log_xp_gain()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.total_xp > COALESCE(OLD.total_xp, 0) THEN
    INSERT INTO xp_events (user_id, amount)
    VALUES (NEW.user_id, NEW.total_xp - COALESCE(OLD.total_xp, 0));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_log_xp_gain ON coach_profiles;
CREATE TRIGGER trigger_log_xp_gain
  AFTER UPDATE OF total_xp ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_xp_gain();

-- ══════════════════════════════════════════════════════════
-- 3) Clasificación semanal
-- ══════════════════════════════════════════════════════════
DROP VIEW IF EXISTS coach_rankings_weekly;
CREATE VIEW coach_rankings_weekly AS
SELECT
  p.user_id,
  p.coach_name,
  p.team_name,
  p.profile_photo,
  p.total_xp,
  p.rank,
  p.created_at,
  p.country,
  p.years_experience,
  p.coaching_style,
  p.favorite_formation,
  p.coach_level,
  p.team_objective,
  w.weekly_xp
FROM (
  SELECT user_id, SUM(amount)::integer AS weekly_xp
  FROM xp_events
  WHERE created_at >= (date_trunc('week', now() AT TIME ZONE 'Europe/Madrid') AT TIME ZONE 'Europe/Madrid')
  GROUP BY user_id
) w
JOIN coach_profiles p ON p.user_id = w.user_id
WHERE p.show_in_ranking
ORDER BY w.weekly_xp DESC;

GRANT SELECT ON coach_rankings_weekly TO authenticated;
