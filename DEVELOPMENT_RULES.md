# SpeedStar 開発運用ルール

このファイルは SpeedStar テンプレートを使用したすべてのプロジェクトで遵守する「基本原則」です。
新機能追加・設定変更を行った際は、このファイルと `README.md` を必ず同期してください。

---

## 1. 画像アセットの命名規則（テーマ機能）

> **目的**: ファイルを上書きするだけで別アーティストのサイトに切り替えられる「着せ替え機能」を維持する。

| 用途 | パス | 形式 | 推奨サイズ |
|---|---|---|---|
| メインロゴ（ヒーロー） | `/public/assets/logo.png` | 透過 PNG | 横長 (例: 1200×400) |
| メインビジュアル (MV) | `/public/assets/mv.jpg` | JPEG | 1920×1080 以上 |
| ナビバー小ロゴ | `/public/assets/logo_icon.png` | 透過 PNG 正方形 | 128×128 以上 |
| ファビコン | `/public/favicon.ico` | ICO / PNG | 32×32, 64×64 |
| メンバー写真 | `/public/assets/members/member_01.jpg` 〜 | JPEG | 縦長 3:4 推奨 |

### ルール
- コード内で画像パスをハードコードする際は、必ず上記のパスを使用すること。
- `src/config/site.ts` の `ogImage` も `/assets/mv.jpg` を基本とする。
- 既存プロジェクトで別パスを使用している場合は、新規構築時に上記に統一すること。

---

## 2. 多言語辞書（i18n）の共通キー

> **目的**: プロジェクト間でキー名を統一し、辞書テンプレートを使い回す。

辞書ファイルは `src/dictionaries/` (または `src/locales/`) に配置する。

### 必須共通キー一覧

```jsonc
// すべてのプロジェクトで以下のキーを同一名で使用すること
{
  "nav": {
    "news":        "NEWS",        // お知らせ / ニュース
    "schedule":    "SCHEDULE",    // スケジュール
    "members":     "MEMBERS",     // メンバー / プロフィール
    "discography": "DISCOGRAPHY", // ディスコグラフィ
    "goods":       "GOODS",
    "video":       "VIDEO",
    "contact":     "CONTACT"
  },
  "footer": {
    "privacy":   "プライバシーポリシー",
    "terms":     "利用規約",
    "company":   "運営会社",
    "copyright": "© 2025 GroupName. All rights reserved."
  },
  "hero": {
    "scroll": "SCROLL"
  }
}
```

### ルール
- 上記キーは**すべてのプロジェクトで変更禁止**。値（表示テキスト）は各言語・アーティストに応じて変更可。
- プロジェクト固有のキー（例: `concept.tagline`）は自由に追加してよいが、共通キーの名前を変えてはならない。
- 新しい共通キーを追加する場合は、このファイルの上記リストを更新すること。

---

## 3. `src/config/site.ts` の管理ルール

> **目的**: サイト固有の設定を一箇所に集約し、コンポーネントへのハードコードを排除する。

### 必須フィールド（削除・名前変更禁止）

```ts
siteConfig.name          // グループ名 (Latin)
siteConfig.nameKana      // グループ名 (日本語)
siteConfig.tagline       // キャッチフレーズ
siteConfig.url           // 本番 URL
siteConfig.sns.youtube   // YouTube チャンネル URL
siteConfig.sns.twitter   // X (Twitter) URL
siteConfig.sns.instagram // Instagram URL
siteConfig.twitterHandle // @ハンドル (twitter:creator meta)
siteConfig.ogImage       // OG 画像パス
siteConfig.descriptions  // { ja, en, th } メタ説明文
siteConfig.keywords      // SEO キーワード配列
siteConfig.locales       // 対応ロケール配列
siteConfig.defaultLocale // デフォルトロケール
```

### ルール
- 設定フィールドを追加した場合は、`README.md` の「Step 4」の説明と本ファイルの上記リストを更新する。
- コンポーネント・レイアウトファイル内でグループ名や SNS URL を直接文字列で書くことを禁止する。必ず `siteConfig.*` を参照すること。

### Shopify URL 正規化ルール

管理画面・DB・`siteConfig` に Shopify URL を保存・使用する際は、以下を必ず確認すること。

| チェック項目 | 正しい例 | 誤った例 |
|---|---|---|
| ストア名のスペルミス | `sugarnote.myshopify.com` | `sugarnoto.myshopify.com` |
| `/password` サフィックスの除去 | `https://sugarnote.myshopify.com` | `https://sugarnote.myshopify.com/password` |
| 末尾スラッシュの統一（なし） | `https://sugarnote.myshopify.com` | `https://sugarnote.myshopify.com/` |
| カスタムドメインの優先 | `https://shop.sugarnote.jp` | `https://sugarnote.myshopify.com` |

**DB 修正 SQL テンプレート**（新PJで同様のミスが発生した場合に使用）：

```sql
-- ストア名スペルミス修正 & /password 除去（テーブル名・カラム名は適宜変更）
UPDATE goods
SET store_url = regexp_replace(
  regexp_replace(store_url, '旧ストア名', '正ストア名', 'g'),
  '/password$', '', 'g'
)
WHERE store_url ILIKE '%旧ストア名%' OR store_url ILIKE '%/password';

UPDATE site_settings
SET shopify_url = regexp_replace(
  regexp_replace(shopify_url, '旧ストア名', '正ストア名', 'g'),
  '/password$', '', 'g'
)
WHERE shopify_url ILIKE '%旧ストア名%' OR shopify_url ILIKE '%/password';
```

**運用フロー**：
1. 管理画面 `/admin/settings` で Shopify URL を入力する際、上記チェック項目を目視確認する
2. Shopify ストアのパスワード保護を解除してから URL を登録する
3. 登録後、フロントエンドのリンクが正しく飛ぶことをブラウザで確認する

---

## 4. RichTextEditor — 画像挿入の標準仕様

> **目的**: 全プロジェクトで一貫したUXと Supabase 連携を保証する。

### 標準実装（変更禁止）

`src/components/admin/RichTextEditor.tsx` の画像挿入は以下の方式を**唯一の標準**とする。

| 操作 | 実装 |
|---|---|
| ボタンクリック | 隠し `<input type="file" accept="image/*">` をトリガー |
| ドラッグ＆ドロップ | `editorProps.handleDrop` でファイルを検知 |
| クリップボードペースト | `editorProps.handlePaste` でクリップボード画像を検知 |
| アップロード先 | Supabase Storage `news-images` バケット |
| ファイル名 | `${Date.now()}_${ランダム6文字}.${拡張子}` (重複防止) |
| 挿入方法 | 公開URL取得後 `editor.chain().setImage({ src })` |
| UX | アップロード中はボタンがスピナーに変わり「アップロード中...」バーを表示 |

### 禁止事項

- `window.prompt()` による URL 直接入力方式は**使用禁止**
- Base64 埋め込み方式は**使用禁止**（DB肥大化・パフォーマンス劣化のため）
- 外部CDN URLの直接貼り付けを誘導するUIは**使用禁止**

### 新プロジェクトへの適用

このコンポーネントはテンプレートから**そのままコピーして使用**する。
バケット名 `news-images` は全プロジェクトで統一する。

---

## 5. 運用ドキュメントの維持

| トリガー | 更新対象 |
|---|---|
| 新機能追加（セクション追加など） | `README.md` のカスタマイズチェックリスト |
| `site.ts` にフィールド追加 | `README.md` Step 4 + 本ファイル §3 |
| 共通 i18n キー追加 | 本ファイル §2 のキー一覧 |
| Supabase スキーマ変更 | `supabase/seed.sql` + `README.md` Schema 概要 |
| 画像パス規約の変更 | 本ファイル §1 のテーブル |
| RichTextEditor の仕様変更 | 本ファイル §4 |

---

## 6. コード生成・提案時の遵守事項

AI・開発者がコードを追加・修正する際は、以下を必ず確認すること：

1. **画像パス** — `/public/assets/` 配下の規約パスを使用しているか
2. **i18n キー** — 共通キーの名前を変えていないか
3. **siteConfig 参照** — グループ名や SNS URL をハードコードしていないか
4. **seed.sql** — Supabase スキーマを変更した場合、`seed.sql` を更新したか
5. **README.md** — 設定手順に影響する変更の場合、ドキュメントを更新したか
6. **RichTextEditor** — 画像挿入は §4 の標準仕様（ファイル選択・D&D）を使用しているか
7. **セキュリティ** — §7 の RLS・View・ポリシー要件を満たしているか

---

## 7. セキュリティ規約

> **目的**: Supabase のデータ漏洩・権限昇格を防ぐ最低限のセキュリティ基準を全プロジェクトで統一する。

### 7-1. View の security_invoker

**全ての View 作成・修正時に `security_invoker = on` を必須とする。**

`security_invoker = on` がない View はビューの定義者権限で実行されるため、RLS をバイパスしてデータが漏洩するリスクがある。

```sql
-- View 作成後に必ず実行する
ALTER VIEW ビュー名 SET (security_invoker = on);

-- 例: news_localized ビュー
ALTER VIEW news_localized SET (security_invoker = on);
```

### 7-2. テーブルの RLS 必須化

**新規テーブル作成時は、CREATE TABLE の直後に必ず RLS を有効化する。**

```sql
CREATE TABLE IF NOT EXISTS my_table ( ... );
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;  -- 必須・忘れ禁止
```

- seed.sql 内の全テーブルに `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` が記述されていること
- 既存プロジェクトで RLS がオフのテーブルが判明した場合は即時有効化すること

### 7-3. contacts テーブルの標準ポリシー

お問い合わせフォーム用 `contacts` テーブルには以下 **2ポリシーを必ず両方** 設定すること：

```sql
-- 非ログインユーザー: フォーム投稿のみ許可（閲覧不可）
CREATE POLICY IF NOT EXISTS "contacts: anon insert"
  ON contacts FOR INSERT TO anon WITH CHECK (true);

-- 認証済みユーザー（管理者）: 全操作許可（閲覧・削除等）
CREATE POLICY IF NOT EXISTS "contacts: authenticated all"
  ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### 7-4. SQL 生成時の自動チェックリスト

Supabase 関連 SQL を生成する際は以下を自動的に含めること：

| 対象 | 必須処理 |
|---|---|
| 新規テーブル | `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` |
| 新規 View | `ALTER VIEW ... SET (security_invoker = on);` |
| contacts 系テーブル | `anon INSERT` + `authenticated ALL` の2ポリシー |
| 管理者専用テーブル | `authenticated ALL` ポリシー（anon アクセスなし） |

---

## 8. 新プロジェクト展開チェックリスト（要約）

```
[ ] src/config/site.ts を新アーティスト用に書き換え
[ ] /public/assets/ に logo.png, mv.jpg, logo_icon.png, favicon.ico を配置
[ ] /public/assets/members/ にメンバー写真を配置
[ ] src/dictionaries/*.json の values（表示テキスト）を更新
[ ] src/constants/members.ts のメンバーデータを更新
[ ] .env.local に Supabase キーと NEXT_PUBLIC_SITE_URL を設定
[ ] Supabase SQL Editor で supabase/seed.sql を実行
[ ] 管理画面 /admin/settings で TimeTree / Shopify URL を設定
[ ] Vercel にカスタムドメインを設定
[ ] README.md を新プロジェクト用に更新（任意）
```

---

*最終更新: 2026-03-18 — SpeedStar Dev Team*
