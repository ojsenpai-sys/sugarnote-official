-- Migration: 009_flap_integration
-- Purpose  : Integrate SugarNote into FLAP's Supabase project.
--            All SugarNote-specific tables are prefixed with "sn_"
--            to avoid name collisions with FLAP's own tables.

-- ── sn_contacts (was: contacts) ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sn_contacts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL,
  company_name TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE sn_contacts ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admins) can read/manage all contact submissions
DROP POLICY IF EXISTS "sn_contacts: authenticated all" ON sn_contacts;
CREATE POLICY "sn_contacts: authenticated all"
  ON sn_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous insert (contact form submissions)
DROP POLICY IF EXISTS "sn_contacts: anon insert" ON sn_contacts;
CREATE POLICY "sn_contacts: anon insert"
  ON sn_contacts FOR INSERT TO anon WITH CHECK (true);
