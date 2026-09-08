-- ==========================================
-- MIGRATION 006: Supabase Storage Bucket "images"
-- Run this SQL in Supabase Studio SQL Editor
-- ==========================================

-- 1. Create the storage bucket (via Dashboard UI recommended, but SQL for reference)
-- NOTE: Supabase Storage buckets must typically be created via the Dashboard UI.
-- Go to: Storage > New Bucket
--   Name: images
--   Public: YES (public read access)
--   File size limit: 5MB
--   Allowed MIME types: image/jpeg, image/png, image/webp

-- 2. Storage Policies (run via SQL Editor after bucket is created)

-- Policy: Public read access for all files in images bucket
CREATE POLICY "Public read access for images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Policy: Admin-only insert (upload) to images bucket
CREATE POLICY "Admin can upload images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admin-only update files in images bucket
CREATE POLICY "Admin can update images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy: Admin-only delete files from images bucket
CREATE POLICY "Admin can delete images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);
