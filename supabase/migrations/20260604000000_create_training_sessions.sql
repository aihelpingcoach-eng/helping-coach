-- Tabla de sesiones de entrenamiento
CREATE TABLE IF NOT EXISTS training_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text NOT NULL,
  date         date NOT NULL DEFAULT CURRENT_DATE,
  category     text NOT NULL,
  exercise_ids uuid[] NOT NULL DEFAULT '{}',
  completed    boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  notes        text NOT NULL DEFAULT '',
  created_at   timestamptz DEFAULT now()
);

-- RLS: cada usuario solo ve y edita sus propias sesiones
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sessions_select" ON training_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_own_sessions_insert" ON training_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_sessions_update" ON training_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_own_sessions_delete" ON training_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Índice para consultas rápidas por usuario
CREATE INDEX IF NOT EXISTS training_sessions_user_id_idx ON training_sessions(user_id, created_at DESC);
