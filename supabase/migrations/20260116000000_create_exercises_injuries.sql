-- ══════════════════════════════════════════════════════════
-- exercises table
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS exercises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text NOT NULL DEFAULT '',
  duration      text NOT NULL DEFAULT '',
  benefit       text NOT NULL DEFAULT '',
  illustration  text NOT NULL DEFAULT '',
  category      text NOT NULL,
  image_url     text DEFAULT NULL,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read exercises"
  ON exercises FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can write exercises"
  ON exercises FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update exercises"
  ON exercises FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete exercises"
  ON exercises FOR DELETE TO authenticated USING (true);

-- ══════════════════════════════════════════════════════════
-- injury_categories table
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS injury_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  icon        text NOT NULL DEFAULT '',
  color       text NOT NULL DEFAULT '',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE injury_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read injury_categories"
  ON injury_categories FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can write injury_categories"
  ON injury_categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update injury_categories"
  ON injury_categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete injury_categories"
  ON injury_categories FOR DELETE TO authenticated USING (true);

-- ══════════════════════════════════════════════════════════
-- injuries table
-- ══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS injuries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL,
  category_id     uuid NOT NULL REFERENCES injury_categories(id) ON DELETE CASCADE,
  name            text NOT NULL,
  what_is         text NOT NULL DEFAULT '',
  how_it_happens  text NOT NULL DEFAULT '',
  treatment       text NOT NULL DEFAULT '',
  prevention      text NOT NULL DEFAULT '',
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read injuries"
  ON injuries FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated can write injuries"
  ON injuries FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update injuries"
  ON injuries FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete injuries"
  ON injuries FOR DELETE TO authenticated USING (true);

-- ══════════════════════════════════════════════════════════
-- Storage bucket for exercise images
-- ══════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exercise-images',
  'exercise-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view exercise images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'exercise-images');

CREATE POLICY "Authenticated can upload exercise images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exercise-images');

CREATE POLICY "Authenticated can update exercise images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'exercise-images');

CREATE POLICY "Authenticated can delete exercise images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'exercise-images');
