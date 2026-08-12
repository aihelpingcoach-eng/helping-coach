/*
  # Ampliar coach_rankings con datos de perfil publicos

  Anade los campos de "estilo de entrenador" (los que se piden en el
  onboarding) a la vista publica de clasificacion, para poder mostrar
  el perfil completo de un entrenador al pulsar su fila en el ranking.
  Sigue sin exponer columnas sensibles (stripe_customer_id, plan,
  plan_expires_at, progress_swipe_days, etc.).
*/

CREATE OR REPLACE VIEW coach_rankings AS
SELECT
  user_id,
  coach_name,
  team_name,
  profile_photo,
  total_xp,
  rank,
  created_at,
  age,
  country,
  years_experience,
  coaching_style,
  favorite_formation,
  coach_level,
  team_objective
FROM coach_profiles
ORDER BY total_xp DESC;

GRANT SELECT ON coach_rankings TO authenticated;
