# SpeedStar Idol Site Template

Next.js 16 + Supabase + Tailwind CSS v4 による、アイドルグループ向けオフィシャルサイトのボイラープレートです。
新規アーティストへの展開は **30 分以内**を目標に設計されています。

---

## 技術スタック

| 層 | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| スタイリング | Tailwind CSS v4 |
| CMS / DB | Supabase (PostgreSQL + Storage) |
| 認証 | Supabase Auth |
| i18n | 日本語 / 英語 / タイ語 (ja / en / th) |
| デプロイ | Vercel |

---

## ディレクトリ構成

```
src/
├── app/
│   ├── [lang]/                   # i18n ルート (ja / en / th)
│   │   ├── layout.tsx            # <html lang>, メタデータ, フォント
│   │   ├── page.tsx              # トップページ (サーバーコンポーネント)
│   │   ├── information/[id]/     # ニュース詳細ページ
│   │   └── admin/                # 管理画面 (要ログイン)
│   │       ├── login/            # ログインページ
│   │       ├── news/             # ニュース管理
│   │       ├── discography/      # ディスコグラフィ管理
│   │       ├── goods/            # グッズ管理
│   │       ├── videos/           # 動画管理
│   │       └── settings/         # サイト設定
│   ├── actions/contact.ts        # お問い合わせ Server Action
│   ├── sitemap.ts                # 動的サイトマップ
│   └── globals.css               # グローバルスタイル, タイポグラフィ
├── components/
│   ├── ClientPage.tsx            # トップページ全体 (クライアントコンポーネント)
│   ├── LanguageSwitcher.tsx      # 言語切替ピル
│   └── admin/
│       ├── ImageUpload.tsx       # Supabase Storage へのアップロード UI
│       └── RichTextEditor.tsx    # Tiptap ベースのリッチテキストエディタ
├── config/
│   └── site.ts                   # ★ サイト固有の設定を一括管理 (まずここを編集)
├── constants/
│   └── members.ts                # メンバーの画像パス・個人 SNS URL
├── dictionaries/                 # 多言語テキスト (ja.json / en.json / th.json)
├── lib/
│   ├── supabase/client.ts        # ブラウザ用 Supabase クライアント
│   ├── supabase/server.ts        # サーバー用 Supabase クライアント
│   └── supabaseAdmin.ts          # 管理者用 Supabase クライアント (service_role key)
└── middleware.ts (proxy.ts)      # Accept-Language によるロケール自動判定
```

---

## 新サイト立ち上げ手順

### Step 1 — リポジトリのコピー

```bash
# GitHub テンプレートからリポジトリを作成
gh repo create <new-site-name> --template <this-repo> --private --clone
cd <new-site-name>
npm install
```

### Step 2 — Supabase プロジェクトの作成

1. [supabase.com](https://supabase.com) で新規プロジェクトを作成
2. SQL エディタを開き、**`supabase/seed.sql` の全内容を貼り付けて実行**
   → 全テーブル・RLS ポリシー・ストレージバケットが一括作成されます

### Step 3 — 環境変数の設定

`.env.local` を作成して以下を記入します：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # 管理画面・Server Action 用

# サイト
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Vercel にデプロイする場合は、同じ変数を Vercel のプロジェクト設定 → Environment Variables に追加してください。

### Step 4 — サイト固有の設定を変更 ★最重要★

**`src/config/site.ts`** を開き、すべての値を新アーティスト用に書き換えます：

```ts
export const siteConfig = {
  name:          "NewGroup",          // グループ名 (Latin)
  nameKana:      "ニューグループ",      // グループ名 (日本語)
  tagline:       "Your tagline here.",
  url:           "https://newgroup.jp",

  sns: {
    youtube:   "https://www.youtube.com/@newgroup",
    twitter:   "https://x.com/newgroup_info",
    instagram: "https://www.instagram.com/newgroup_official/",
  },

  twitterHandle: "@newgroup_info",
  ogImage:       "/images/group_main.jpg",

  descriptions: {
    ja: "日本語のメタ説明文",
    en: "English meta description",
    th: "คำอธิบายภาษาไทย",
  },

  keywords:  ["NewGroup", "アイドル", "idol", ...],
  authors:   [{ name: "NewGroup Management" }],
  creator:   "NewGroup Project",
  publisher: "NewGroup Publisher",
};
```

### Step 5 — メンバーデータの差し替え

**`src/constants/members.ts`** — メンバーごとの画像パス・個人 SNS URL を更新します：

```ts
export const MEMBERS_META = {
  member_01: {
    image: "/images/member_01.jpg",
    sns: { tiktok: "...", instagram: "...", x: "..." },
  },
  // ...
};
```

**`src/dictionaries/ja.json`** (+ `en.json`, `th.json`) — `members[]` 配列の各フィールド（name, kana, birth, origin, mbti, experience）を更新します。

### Step 6 — 画像・ロゴの差し替え

`/public/images/` 内の以下のファイルを差し替えてください：

| ファイル | 用途 |
|---|---|
| `group_main.jpg` | ヒーロービジュアル (推奨: 1920×1080) |
| `logo_ribbon.png` | ヒーローセクションのメインロゴ (透過PNG) |
| `logo_heart.png` | ナビゲーションバーの小ロゴ (透過PNG, 正方形) |
| `member_01.jpg` ～ `member_0N.jpg` | メンバー個人写真 (推奨: 3:4 縦長) |
| `/public/icon.png` | ファビコン |

### Step 7 — 多言語テキストの更新

`src/dictionaries/ja.json` / `en.json` / `th.json` で、コンセプト文・セクション説明・フッターなどのテキストを差し替えてください。

### Step 8 — カラーテーマの変更（任意）

`src/app/globals.css` の `@theme` ブロックで各 `--color-pink-*` 変数を上書きすることで、ピンク系から別の色系に変更できます。

### Step 9 — ローカル確認 → デプロイ

```bash
npm run dev       # http://localhost:3000 で確認
npm run build     # ビルドエラーがないことを確認
git push origin main   # Vercel が自動デプロイ
```

---

## 管理画面の使い方

`/ja/admin/login` からログインします（Supabase Auth の Email/Password）。

| 管理ページ | 操作内容 |
|---|---|
| `/admin/news` | ニュース記事の作成・編集・削除、AI 自動翻訳 |
| `/admin/discography` | シングル・アルバムの登録 |
| `/admin/goods` | グッズの登録、在庫切れ管理 |
| `/admin/videos` | YouTube 動画の登録 |
| `/admin/settings` | ヒーロー画像・TimeTree URL・Shopify URL の設定 |

---

## Supabase Schema 概要

| テーブル | 主な列 |
|---|---|
| `site_settings` | hero_image_url, calendar_id, timetree_url, shopify_url |
| `news` | title, content, image_url, category, status, published_at, title_i18n, content_i18n |
| `discography` | title, release_date, cover_url, listen_url |
| `goods` | name, price, image_url, store_url, is_sold_out |
| `videos` | title, youtube_id |
| `contacts` | name, email, company_name, type, message |

ストレージバケット:
- `images` — ヒーロー画像・グッズ画像・ジャケット画像など
- `news-images` — ニュース記事本文内の埋め込み画像

---

## カスタマイズチェックリスト

- [ ] `src/config/site.ts` — グループ名・SNS・メタ情報
- [ ] `src/constants/members.ts` — メンバー画像・個人 SNS
- [ ] `src/dictionaries/*.json` — 多言語テキスト・メンバープロフィール
- [ ] `/public/images/` — ロゴ・ヒーロー画像・メンバー写真
- [ ] `.env.local` / Vercel 環境変数 — Supabase キー・サイト URL
- [ ] Supabase SQL Editor — `supabase/seed.sql` を実行
- [ ] 管理画面 `/admin/settings` — TimeTree / Shopify URL を設定
- [ ] Vercel でカスタムドメインを設定

---

## ライセンス

このテンプレートは SpeedStar Inc. が所有するプロプライエタリコードです。
無断での再配布・転用はご遠慮ください。
