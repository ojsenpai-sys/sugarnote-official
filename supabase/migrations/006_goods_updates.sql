-- Migration: 006_goods_updates
-- Purpose  : 1. Add updated_at column to goods (fixes trigger error)
--            2. Add sort_order column for manual display ordering
--            3. Fix Shopify URL typos (sugarnoto → sugarnote, strip /password)

-- ── 1. updated_at ──────────────────────────────────────────────────────────
ALTER TABLE goods
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Auto-update trigger (reuse function if already exists from another table)
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_goods_updated_at ON goods;
CREATE TRIGGER trg_goods_updated_at
  BEFORE UPDATE ON goods
  FOR EACH ROW
  EXECUTE FUNCTION fn_set_updated_at();

-- ── 2. sort_order ──────────────────────────────────────────────────────────
ALTER TABLE goods
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Initialize existing rows with sequential order by created_at
UPDATE goods g
SET sort_order = sub.rn - 1
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn FROM goods
) sub
WHERE g.id = sub.id;

-- ── 3. Fix Shopify URL typos ───────────────────────────────────────────────
-- Fix typo: sugarnoto → sugarnote, remove /password suffix on goods rows
UPDATE goods
SET store_url = regexp_replace(
  regexp_replace(store_url, 'sugarnoto', 'sugarnote', 'g'),
  '/password$', '', 'g'
)
WHERE store_url ILIKE '%sugarnoto%' OR store_url ILIKE '%/password';

-- Fix same typos on site_settings.shopify_url
UPDATE site_settings
SET shopify_url = regexp_replace(
  regexp_replace(shopify_url, 'sugarnoto', 'sugarnote', 'g'),
  '/password$', '', 'g'
)
WHERE shopify_url ILIKE '%sugarnoto%' OR shopify_url ILIKE '%/password';
