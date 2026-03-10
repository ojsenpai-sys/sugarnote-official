-- Add English and Thai translation fields to the existing 'news' table
ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_th TEXT,
ADD COLUMN IF NOT EXISTS content_en TEXT,     -- Using TEXT to store HTML from Tiptap, similar to the original content field
ADD COLUMN IF NOT EXISTS content_th TEXT;

-- (Optional) Update existing rows to mirror the Japanese content if needed
-- UPDATE public.news SET title_en = title, title_th = title WHERE title_en IS NULL;

-- If you are not using RLS, no further policies are needed.
-- If RLS is enabled, the existing policies on the 'news' table will automatically apply equally to these new columns.
