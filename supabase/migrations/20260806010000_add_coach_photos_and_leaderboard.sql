/*
  # Foto de perfil del entrenador + clasificacion publica

  1. Bucket "coach-photos": publico para lectura, cada usuario solo puede
     escribir dentro de su propia carpeta (mismo patron que player-images).

  2. Vista "coach_rankings": expone solo los campos seguros de
     coach_profiles (nombre, equipo, foto, XP, rango) para TODOS los
     entrenadores, ordenable por XP. coach_profiles tiene RLS que solo
     deja ver la fila propia; esta vista se crea sin RLS propio y
     corre con los privilegios de su dueño (postgres), por lo que
     puede leer todas las filas sin exponer columnas sensibles como
     stripe_customer_id o plan_expires_at.
*/

-- 1) Bucket de fotos de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coach-photos',
  'coach-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view coach photos"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'coach-photos');

CREATE POLICY "Users can upload own coach photo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'coach-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own coach photo"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'coach-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'coach-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own coach photo"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'coach-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2) Vista publica de clasificacion (sin columnas sensibles)
CREATE OR REPLACE VIEW coach_rankings AS
SELECT
  user_id,
  coach_name,
  team_name,
  profile_photo,
  total_xp,
  rank,
  created_at
FROM coach_profiles
ORDER BY total_xp DESC;

GRANT SELECT ON coach_rankings TO authenticated;
