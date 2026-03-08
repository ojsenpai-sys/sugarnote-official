# Idol Web Template Boilerplate

Next.js + Tailwind CSS + Supabase
による量産化可能なアイドル・アーティスト向け公式サイト用テンプレートです。

## 新サイト立ち上げ手順

1. **データベースの準備** Supabaseで新規プロジェクトを作成し、SQL Editor
   にてプロジェクト直下にある `init_schema.sql`
   をコピペして実行してください。テーブル構造が一瞬で構築されます。
2. **デザインの反映** `src/config/site.ts`
   を開き、新しく展開するブランドやグループの「名前」「テーマカラー（16進数）」「フォント」などに書き換えてください。
3. **デプロイメント** Vercel 等にリポジトリを連携し、環境変数
   (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   など各種メール等シークレット) を新しい Supabase
   プロジェクトのものに差し替えてデプロイしてください。これだけで本番環境の立ち上げが完了します。
