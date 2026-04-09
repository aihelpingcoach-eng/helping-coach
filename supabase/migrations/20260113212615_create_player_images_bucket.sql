/*
  # Create Storage Bucket for Player Images

  1. New Storage Bucket
    - `player-images` bucket for storing player profile images
    - Public bucket (images can be viewed by anyone)
    - Authenticated users can upload images

  2. Security
    - Enable RLS on storage.objects
    - Policy: Authenticated users can upload images
    - Policy: Everyone can view images (public bucket)
    - Policy: Users can update their own images
    - Policy: Users can delete their own images

  3. Notes
    - Images are stored with unique filenames to prevent collisions
    - Maximum file size should be enforced on the client side
    - Supported formats: jpg, jpeg, png, webp
*/

-- Create the bucket for player images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'player-images',
  'player-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload player images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'player-images'
);

-- Policy: Everyone can view images (public bucket)
CREATE POLICY "Anyone can view player images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'player-images');

-- Policy: Users can update their own images
CREATE POLICY "Users can update own player images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'player-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'player-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own player images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'player-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
