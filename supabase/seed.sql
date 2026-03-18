-- =============================================================================
-- SpeedStar Idol Site Template — Complete Supabase Seed
-- =============================================================================
-- Run this file once in the Supabase SQL Editor for a brand-new project.
-- It creates all tables, indexes, RLS policies, and storage buckets from
-- scratch.  Idempotent: every statement uses IF NOT EXISTS / ON CONFLICT.
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- Site-wide settings (singleton row with id = 1)
CREATE TABLE IF NOT EXISTS site_settings (
  id              INTEGER PRIMARY KEY DEFAULT 1,
  hero_image_url  TEXT    NOT NULL DEFAULT '',
  calendar_id     TEXT    NOT NULL DEFAULT '',
  timetree_url    TEXT    NOT NULL DEFAULT '',
  shopify_url     TEXT    NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed the singleton row so the app never gets a 404 on first load
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- News / Information articles
CREATE TABLE IF NOT EXISTS news (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  content       TEXT        NOT NULL DEFAULT '',
  image_url     TEXT,
  category      TEXT,
  status        TEXT        NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'published')),
  published_on  TEXT,                          -- Display date string (YYYY.MM.DD)
  published_at  TIMESTAMPTZ,
  title_i18n    JSONB       NOT NULL DEFAULT '{}',
  content_i18n  JSONB       NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_news_title_i18n_keys   CHECK ((title_i18n   = '{}') OR (title_i18n   - '{ja,en,th}'::text[] = '{}')),
  CONSTRAINT chk_news_content_i18n_keys CHECK ((content_i18n = '{}') OR (content_i18n - '{ja,en,th}'::text[] = '{}'))
);

CREATE INDEX IF NOT EXISTS idx_news_status_published_at ON news (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_title_i18n ON news USING GIN (title_i18n);

-- Resolved view (convenience — not required by the app)
CREATE OR REPLACE VIEW news_localized AS
  SELECT n.*, lang.value AS _lang,
    COALESCE(n.title_i18n   ->> lang.value, n.title)   AS title_localized,
    COALESCE(n.content_i18n ->> lang.value, n.content) AS content_localized
  FROM news n, (VALUES ('ja'), ('en'), ('th')) AS lang(value);

-- §7-1: security_invoker prevents RLS bypass via view definer privileges
ALTER VIEW news_localized SET (security_invoker = on);


-- Discography (singles, albums, etc.)
CREATE TABLE IF NOT EXISTS discography (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  release_date  TEXT,                          -- Display string (YYYY.MM.DD)
  cover_url     TEXT,
  listen_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Goods / merchandise
CREATE TABLE IF NOT EXISTS goods (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  price         INTEGER     NOT NULL DEFAULT 0,
  image_url     TEXT,
  store_url     TEXT,
  is_sold_out   BOOLEAN     NOT NULL DEFAULT FALSE,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update trigger for goods.updated_at
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


-- Videos (YouTube embeds)
CREATE TABLE IF NOT EXISTS videos (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  youtube_id    TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  company_name  TEXT,
  type          TEXT        NOT NULL,
  message       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE news            ENABLE ROW LEVEL SECURITY;
ALTER TABLE discography     ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods           ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts        ENABLE ROW LEVEL SECURITY;

-- site_settings: public read, service-role write
CREATE POLICY IF NOT EXISTS "site_settings: public read"
  ON site_settings FOR SELECT USING (true);

-- news: public can read published articles only
CREATE POLICY IF NOT EXISTS "news: public read published"
  ON news FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

-- news: service role (admin) has full access — handled via supabaseAdmin key

-- discography / goods / videos: public read
CREATE POLICY IF NOT EXISTS "discography: public read"
  ON discography FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "goods: public read"
  ON goods FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "videos: public read"
  ON videos FOR SELECT USING (true);

-- contacts: insert-only for anon (form submissions); no public read
CREATE POLICY IF NOT EXISTS "contacts: anon insert"
  ON contacts FOR INSERT TO anon WITH CHECK (true);

-- contacts: authenticated users (admins) can read and manage all submissions
CREATE POLICY IF NOT EXISTS "contacts: authenticated all"
  ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────────────────────────────

-- General-purpose image bucket (hero, goods, discography covers, settings)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "images: auth upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY IF NOT EXISTS "images: auth delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'images');


-- News article body images (uploaded via RichTextEditor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY IF NOT EXISTS "news-images: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY IF NOT EXISTS "news-images: auth upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'news-images');

CREATE POLICY IF NOT EXISTS "news-images: auth delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'news-images');


-- =============================================================================
-- Security checklist (§7 of DEVELOPMENT_RULES.md):
--   [x] All tables have RLS enabled
--   [x] news_localized view has security_invoker = on
--   [x] contacts has both anon INSERT and authenticated ALL policies
-- =============================================================================
-- Done.  Visit your project's Supabase dashboard to verify tables and buckets.
-- =============================================================================
