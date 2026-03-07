-- add_news_status.sql
-- newsテーブルに status と published_at カラムを追加します。
-- ※既存のレコードがある場合を考慮し、デフォルト値を設定しています。

ALTER TABLE public.news ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 既存の公開日（published_on: DATE型）のデータを published_at に移行する場合（任意）
UPDATE public.news SET published_at = published_on::timestamp AT TIME ZONE 'Asia/Tokyo' WHERE published_at IS NULL OR published_at = timezone('utc'::text, now());
