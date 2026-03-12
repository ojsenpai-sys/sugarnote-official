-- Migration: 004_site_settings_timetree
-- Purpose  : Add timetree_url column to site_settings table

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS timetree_url TEXT NOT NULL DEFAULT '';
