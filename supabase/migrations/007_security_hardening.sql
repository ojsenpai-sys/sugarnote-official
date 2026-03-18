-- Migration: 007_security_hardening
-- Purpose  : Apply §7 security standards (DEVELOPMENT_RULES.md) to existing project
--
-- 1. Set security_invoker = on on all views (prevents RLS bypass)
-- 2. Ensure RLS is enabled on all tables (idempotent)
-- 3. Add authenticated ALL policy to contacts table

-- ── 1. View security_invoker ──────────────────────────────────────────────
ALTER VIEW news_localized SET (security_invoker = on);

-- ── 2. RLS — ensure all tables are covered (idempotent) ──────────────────
ALTER TABLE site_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE news            ENABLE ROW LEVEL SECURITY;
ALTER TABLE discography     ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods           ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts        ENABLE ROW LEVEL SECURITY;

-- ── 3. contacts: add authenticated ALL policy ─────────────────────────────
CREATE POLICY IF NOT EXISTS "contacts: authenticated all"
  ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
