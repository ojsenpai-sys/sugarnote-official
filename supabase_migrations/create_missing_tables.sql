-- ==============================================================================
-- SugarNote CMS: Database Initialization for Missing Tables (v2: Multi-Language)
-- ==============================================================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. GOODS TABLE (グッズ管理)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.goods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Japanese (Default)
  name_ja TEXT NOT NULL,
  description_ja TEXT,
  -- English
  name_en TEXT,
  description_en TEXT,
  -- Thai
  name_th TEXT,
  description_th TEXT,
  -- Common Fields
  price INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  is_sold_out BOOLEAN DEFAULT false,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. DISCOGRAPHY TABLE (楽曲・アルバム管理)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.discography (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Japanese (Default)
  title_ja TEXT NOT NULL,
  -- English
  title_en TEXT,
  -- Thai
  title_th TEXT,
  -- Common Fields
  release_date DATE,
  type TEXT CHECK (type IN ('single', 'album', 'digital')),
  jacket_url TEXT,
  streaming_url TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. SCHEDULE TABLE (イベント・ライブ管理)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Japanese (Default)
  title_ja TEXT NOT NULL,
  location_ja TEXT,
  -- English
  title_en TEXT,
  location_en TEXT,
  -- Thai
  title_th TEXT,
  location_th TEXT,
  -- Common Fields
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  ticket_url TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- 1. Policies for 'goods'
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.goods;
CREATE POLICY "Public profiles are viewable by everyone." ON public.goods
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert goods" ON public.goods;
CREATE POLICY "Admins can insert goods" ON public.goods
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update goods" ON public.goods;
CREATE POLICY "Admins can update goods" ON public.goods
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete goods" ON public.goods;
CREATE POLICY "Admins can delete goods" ON public.goods
  FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Policies for 'discography'
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.discography;
CREATE POLICY "Public profiles are viewable by everyone." ON public.discography
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert discography" ON public.discography;
CREATE POLICY "Admins can insert discography" ON public.discography
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update discography" ON public.discography;
CREATE POLICY "Admins can update discography" ON public.discography
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete discography" ON public.discography;
CREATE POLICY "Admins can delete discography" ON public.discography
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Policies for 'schedule'
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.schedule;
CREATE POLICY "Public profiles are viewable by everyone." ON public.schedule
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert schedule" ON public.schedule;
CREATE POLICY "Admins can insert schedule" ON public.schedule
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can update schedule" ON public.schedule;
CREATE POLICY "Admins can update schedule" ON public.schedule
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can delete schedule" ON public.schedule;
CREATE POLICY "Admins can delete schedule" ON public.schedule
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATES (Optional Trigger Functions)
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist to prevent duplication errors
DROP TRIGGER IF EXISTS update_goods_timestamp ON public.goods;
DROP TRIGGER IF EXISTS update_discography_timestamp ON public.discography;
DROP TRIGGER IF EXISTS update_schedule_timestamp ON public.schedule;

-- Attach triggers to auto-update 'updated_at' columns
CREATE TRIGGER update_goods_timestamp BEFORE UPDATE ON public.goods FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_discography_timestamp BEFORE UPDATE ON public.discography FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER update_schedule_timestamp BEFORE UPDATE ON public.schedule FOR EACH ROW EXECUTE FUNCTION set_updated_at();
