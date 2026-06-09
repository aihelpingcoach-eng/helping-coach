-- Añade columna level_after a player_progress para guardar el nivel absoluto tras cada cambio
ALTER TABLE player_progress ADD COLUMN IF NOT EXISTS level_after integer;
