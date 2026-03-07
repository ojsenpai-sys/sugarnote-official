-- SugarNote CMS Database Setup Script
-- Run this script in the Supabase SQL Editor

-- 1. Create Tables

-- News Table
CREATE TABLE public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT, -- HTML from Tiptap
    image_url TEXT,
    published_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Discography Table
CREATE TABLE public.discography (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    release_date DATE NOT NULL,
    cover_url TEXT,
    description TEXT,
    links JSONB, -- store streaming links like {"spotify": "...", "apple_music": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Goods Table
CREATE TABLE public.goods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT,
    store_url TEXT,
    is_sold_out BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Videos Table
CREATE TABLE public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    youtube_id TEXT NOT NULL,
    title TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings Table (Single row)
CREATE TABLE public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_image_url TEXT,
    calendar_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default site settings
INSERT INTO public.site_settings (id, hero_image_url) VALUES (1, '/images/group_main.jpg') ON CONFLICT DO NOTHING;

-- 2. Storage Bucket for Images
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

-- 3. Row Level Security (RLS) Policies 
-- Restrict modifications to Authenticated Users (Admins) but allow Public reads

-- Enable RLS on all tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public READ definitions (everyone can view)
CREATE POLICY "Public news are viewable by everyone." ON public.news FOR SELECT USING (true);
CREATE POLICY "Public discography are viewable by everyone." ON public.discography FOR SELECT USING (true);
CREATE POLICY "Public goods are viewable by everyone." ON public.goods FOR SELECT USING (true);
CREATE POLICY "Public videos are viewable by everyone." ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone." ON public.site_settings FOR SELECT USING (true);

-- Authenticated Users (Admins) can do everything
CREATE POLICY "Admins can insert news" ON public.news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update news" ON public.news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete news" ON public.news FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert discography" ON public.discography FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update discography" ON public.discography FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete discography" ON public.discography FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert goods" ON public.goods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update goods" ON public.goods FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete goods" ON public.goods FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);

-- Storage Policies
-- We need to create policies in the storage schema for the objects table
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admin Updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images');
CREATE POLICY "Admin Deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
