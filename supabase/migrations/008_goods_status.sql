-- Migration: 008_goods_status
-- Purpose  : Add status column to goods for publish/draft workflow

ALTER TABLE goods
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published'
  CHECK (status IN ('published', 'draft'));

-- All existing items are live, so default them to published
UPDATE goods SET status = 'published' WHERE status IS NULL;

-- Index for efficient filtering on the public page
CREATE INDEX IF NOT EXISTS idx_goods_status ON goods(status);

-- ── Fix store_url typo: sugarnoto → sugarnote ──────────────────────────────
-- Items added after migration 006 may still have the wrong domain
UPDATE goods
SET store_url = replace(store_url, 'sugarnoto.myshopify.com', 'sugarnote.myshopify.com')
WHERE store_url ILIKE '%sugarnoto.myshopify.com%';
