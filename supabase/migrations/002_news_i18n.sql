-- =============================================================
-- Migration: 002_news_i18n
-- Purpose  : Add multilingual (i18n) support to the news table
--            via JSONB columns for title and content translations.
--
-- Design   : Keep existing `title` and `content` columns as the
--            Japanese canonical source. Translation data for other
--            languages (en, th) is stored in `title_i18n` and
--            `content_i18n` JSONB columns.
--
-- Fallback : Application reads title_i18n->>'en' first; if missing,
--            falls back to the canonical `title` (Japanese).
--
-- Example  : title_i18n = '{"en": "English Title", "th": "..."}'
-- =============================================================

-- 1. Add i18n JSONB columns to the news table
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS title_i18n   JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS content_i18n JSONB NOT NULL DEFAULT '{}';

-- 2. GIN index for fast key-based lookups (e.g. title_i18n ? 'en')
CREATE INDEX IF NOT EXISTS idx_news_title_i18n
  ON news USING GIN (title_i18n);

-- 3. Add a check constraint to ensure only valid locale keys are stored
--    (Prevents typos like "jp" or "english" from being inserted)
ALTER TABLE news
  ADD CONSTRAINT chk_news_title_i18n_keys CHECK (
    (title_i18n = '{}') OR
    (title_i18n - '{ja,en,th}'::text[] = '{}')
  ),
  ADD CONSTRAINT chk_news_content_i18n_keys CHECK (
    (content_i18n = '{}') OR
    (content_i18n - '{ja,en,th}'::text[] = '{}')
  );

-- 4. Helper view: resolves the localized title/content for a given lang.
--    Usage: SELECT * FROM news_localized WHERE lang = 'en';
--    (Optional convenience view — not required by the application)
CREATE OR REPLACE VIEW news_localized AS
  SELECT
    n.*,
    lang.value                                    AS _lang,
    COALESCE(n.title_i18n   ->> lang.value, n.title)   AS title_localized,
    COALESCE(n.content_i18n ->> lang.value, n.content) AS content_localized
  FROM
    news n,
    (VALUES ('ja'), ('en'), ('th')) AS lang(value);

-- =============================================================
-- Rollback (run manually if needed):
--
--   DROP VIEW IF EXISTS news_localized;
--   ALTER TABLE news
--     DROP CONSTRAINT IF EXISTS chk_news_title_i18n_keys,
--     DROP CONSTRAINT IF EXISTS chk_news_content_i18n_keys,
--     DROP COLUMN IF EXISTS title_i18n,
--     DROP COLUMN IF EXISTS content_i18n;
--   DROP INDEX IF EXISTS idx_news_title_i18n;
-- =============================================================
