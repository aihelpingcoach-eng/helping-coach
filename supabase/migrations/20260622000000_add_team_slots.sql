/*
  # Añadir team_slot a formations

  Permite guardar hasta 3 equipos independientes por usuario. Cada fila de
  `formations` pasa de representar "un tipo de formación" a representar
  "un slot de equipo" (1, 2 o 3), cuyo formation_type ahora es mutable.
*/

ALTER TABLE formations
  ADD COLUMN IF NOT EXISTS team_slot smallint NOT NULL DEFAULT 1
    CHECK (team_slot IN (1, 2, 3));

CREATE INDEX IF NOT EXISTS idx_formations_user_slot ON formations(user_id, team_slot);
