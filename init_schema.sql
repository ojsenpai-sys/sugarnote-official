-- ==========================================
-- Idol Web Template Init Schema
-- ==========================================
-- Supabase の SQL Editor に貼り付けて実行してください。
-- このスクリプトは、テンプレートで用いられる全テーブルと基本的な初期データを一括構築します。

-- 1. news テーブル（お知らせ・ブログ用）
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT, -- HTMLリッチテキスト形式で保存されます
    image_url TEXT,
    category TEXT DEFAULT 'NEWS',
    published_on DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- CMS機能用追加カラム
    status TEXT DEFAULT 'published', -- 'draft' (下書き) または 'published' (公開)
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) -- 予約日時
);
COMMENT ON TABLE public.news IS 'ニュースやブログ記事を管理するテーブル';

-- 2. site_settings テーブル（トップページのメインビジュアルや全体設定）
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_image_url TEXT, -- メインビジュアルの画像URL
    google_calendar_id TEXT, -- スケジュール同期用カレンダーID等
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.site_settings IS 'サイト全体のグローバルな設定値を格納するテーブル (1レコードのみ使用)';

-- site_settings の初期レコードを作成（必ず id=1 が存在するようにする）
INSERT INTO public.site_settings (id, updated_at)
VALUES (1, now())
ON CONFLICT (id) DO NOTHING;

-- 3. discography テーブル（楽曲リリース情報）
CREATE TABLE IF NOT EXISTS public.discography (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    release_date DATE,
    image_url TEXT,
    links JSONB, -- Spotify, Apple Music などの各配信リンク ({ "spotify": "URL", "apple": "URL" })
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.discography IS '楽曲のディスコグラフィー情報を管理するテーブル';

-- 4. goods テーブル（オンラインストア商品誘導）
CREATE TABLE IF NOT EXISTS public.goods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER,
    image_url TEXT,
    store_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.goods IS '公式グッズの情報を管理するテーブル';

-- 5. videos テーブル（YouTube連携など）
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    youtube_id TEXT NOT NULL, -- YouTubeの動画ID (例: dQw4w9WgXcQ)
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.videos IS 'YouTube等の動画情報を管理するテーブル';

-- 6. contacts テーブル（お問い合わせ履歴保存用）
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
COMMENT ON TABLE public.contacts IS 'お問い合わせフォームからの送信内容を記録するテーブル';

-- ==========================================
-- セキュリティ (RLS) および ストレージ設定
-- ※実運用時には Auth と RLS（Row Level Security）をオンにし、適宜ポリシーを設定してください。
-- ==========================================
-- ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
-- (以下、他テーブルも同様)
