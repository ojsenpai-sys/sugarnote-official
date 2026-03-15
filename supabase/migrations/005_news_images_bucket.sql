-- Migration: 005_news_images_bucket
-- Purpose  : Create Supabase Storage bucket for news article body images

-- Create bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY IF NOT EXISTS "news-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "news-images: auth upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'news-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY IF NOT EXISTS "news-images: auth delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'news-images');
