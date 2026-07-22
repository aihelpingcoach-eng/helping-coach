/*
  # Cerrar bypasses de autorización enforced solo en frontend

  Hasta ahora, el admin (biblioteca de ejercicios/lesiones) y el plan
  Free/Pro solo se comprobaban en la UI de React. Cualquier usuario
  autenticado podía llamar a la API de Supabase directamente y saltarse
  esos controles. Esta migración los aplica también en la base de datos.

  1. coach_profiles: un trigger evita que nadie salvo el service_role
     (usado por el webhook de Stripe) modifique plan/stripe_customer_id/
     plan_expires_at, incluso en su propia fila.
  2. exercises / injury_categories / injuries: las políticas de escritura
     pasan de "cualquier autenticado" a "solo el email admin".
  3. Bucket exercise-images: mismo tratamiento para las políticas de escritura.
  4. Bucket player-images: el INSERT ahora exige que el archivo se suba
     dentro de la carpeta del propio usuario (igual que ya exigían UPDATE/DELETE).
  5. Nueva tabla ai_usage_daily para que la Edge Function ai-service pueda
     aplicar un límite diario de uso por usuario, sin que el cliente pueda
     leer ni falsificar su propio contador (RLS habilitado, sin políticas
     para anon/authenticated: solo el service_role la toca).
*/

-- ══════════════════════════════════════════════════════════
-- 1) Proteger columnas de facturación en coach_profiles
-- ══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION protect_coach_profile_billing_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    IF TG_OP = 'INSERT' THEN
      NEW.plan := 'free';
      NEW.stripe_customer_id := NULL;
      NEW.plan_expires_at := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
      NEW.plan := OLD.plan;
      NEW.stripe_customer_id := OLD.stripe_customer_id;
      NEW.plan_expires_at := OLD.plan_expires_at;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_protect_billing_fields ON coach_profiles;
CREATE TRIGGER trigger_protect_billing_fields
  BEFORE INSERT OR UPDATE ON coach_profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_coach_profile_billing_fields();

-- ══════════════════════════════════════════════════════════
-- 2) Restringir escritura de exercises / injury_categories / injuries al admin
-- ══════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Authenticated can write exercises" ON exercises;
DROP POLICY IF EXISTS "Authenticated can update exercises" ON exercises;
DROP POLICY IF EXISTS "Authenticated can delete exercises" ON exercises;

CREATE POLICY "Admin can insert exercises"
  ON exercises FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can update exercises"
  ON exercises FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can delete exercises"
  ON exercises FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

DROP POLICY IF EXISTS "Authenticated can write injury_categories" ON injury_categories;
DROP POLICY IF EXISTS "Authenticated can update injury_categories" ON injury_categories;
DROP POLICY IF EXISTS "Authenticated can delete injury_categories" ON injury_categories;

CREATE POLICY "Admin can insert injury_categories"
  ON injury_categories FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can update injury_categories"
  ON injury_categories FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can delete injury_categories"
  ON injury_categories FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

DROP POLICY IF EXISTS "Authenticated can write injuries" ON injuries;
DROP POLICY IF EXISTS "Authenticated can update injuries" ON injuries;
DROP POLICY IF EXISTS "Authenticated can delete injuries" ON injuries;

CREATE POLICY "Admin can insert injuries"
  ON injuries FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can update injuries"
  ON injuries FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com')
  WITH CHECK ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can delete injuries"
  ON injuries FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

-- ══════════════════════════════════════════════════════════
-- 3) Mismo tratamiento para el bucket exercise-images
-- ══════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Authenticated can upload exercise images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update exercise images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete exercise images" ON storage.objects;

CREATE POLICY "Admin can upload exercise images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exercise-images' AND (auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can update exercise images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'exercise-images' AND (auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

CREATE POLICY "Admin can delete exercise images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'exercise-images' AND (auth.jwt() ->> 'email') = 'ai.helpingcoach@gmail.com');

-- ══════════════════════════════════════════════════════════
-- 4) player-images: el INSERT también debe respetar la carpeta del usuario
-- ══════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Authenticated users can upload player images" ON storage.objects;

CREATE POLICY "Users can upload own player images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'player-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ══════════════════════════════════════════════════════════
-- 5) Tabla de rate limiting para la Edge Function ai-service
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS ai_usage_daily (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date  date NOT NULL,
  call_count  integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, usage_date)
);

ALTER TABLE ai_usage_daily ENABLE ROW LEVEL SECURITY;
-- Sin políticas para anon/authenticated a propósito: solo el service_role
-- (usado por la Edge Function ai-service) puede leer/escribir esta tabla,
-- para que el cliente nunca pueda leer ni resetear su propio contador.
