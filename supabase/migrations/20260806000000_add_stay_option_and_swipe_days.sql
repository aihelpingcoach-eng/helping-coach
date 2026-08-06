/*
  # Opción "mantener nivel" y días de evaluación en Progreso

  1. player_progress.swipe_direction admite ahora 'stay' además de
     'left'/'right', para registrar cuando el coach decide que un
     jugador se mantiene en su nivel actual.
  2. coach_profiles gana dos columnas nuevas:
     - progress_swipe_days: qué días de la semana (0=domingo..6=sábado)
       puede el coach hacer la ronda de evaluación de jugadores.
       Por defecto todos los días, para no romper el comportamiento
       actual de nadie hasta que lo configuren.
     - last_swipe_session_date: la última fecha en la que se completó
       una ronda completa de evaluación, para limitarla a una vez al día.
*/

-- 1) Permitir 'stay' en player_progress
ALTER TABLE player_progress DROP CONSTRAINT IF EXISTS player_progress_swipe_direction_check;
ALTER TABLE player_progress ADD CONSTRAINT player_progress_swipe_direction_check
  CHECK (swipe_direction IN ('left', 'right', 'stay'));

-- 2) Configuración de días de evaluación en coach_profiles
ALTER TABLE coach_profiles
  ADD COLUMN IF NOT EXISTS progress_swipe_days integer[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}';

ALTER TABLE coach_profiles
  ADD COLUMN IF NOT EXISTS last_swipe_session_date date;
