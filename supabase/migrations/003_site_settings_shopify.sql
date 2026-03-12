-- Migration: 003_site_settings_shopify
-- Purpose  : Add shopify_url column to site_settings table

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS shopify_url TEXT NOT NULL DEFAULT '';
