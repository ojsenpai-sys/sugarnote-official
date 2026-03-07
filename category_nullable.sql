-- category_nullable.sql
-- 既存の category カラムの NOT NULL 制約を削除します
ALTER TABLE public.news ALTER COLUMN category DROP NOT NULL;
