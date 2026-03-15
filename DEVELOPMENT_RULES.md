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

---

## 4. 運用ドキュメントの維持

| トリガー | 更新対象 |
|---|---|
| 新機能追加（セクション追加など） | `README.md` のカスタマイズチェックリスト |
| `site.ts` にフィールド追加 | `README.md` Step 4 + 本ファイル §3 |
| 共通 i18n キー追加 | 本ファイル §2 のキー一覧 |
| Supabase スキーマ変更 | `supabase/seed.sql` + `README.md` Schema 概要 |
| 画像パス規約の変更 | 本ファイル §1 のテーブル |

---

## 5. コード生成・提案時の遵守事項

AI・開発者がコードを追加・修正する際は、以下を必ず確認すること：

1. **画像パス** — `/public/assets/` 配下の規約パスを使用しているか
2. **i18n キー** — 共通キーの名前を変えていないか
3. **siteConfig 参照** — グループ名や SNS URL をハードコードしていないか
4. **seed.sql** — Supabase スキーマを変更した場合、`seed.sql` を更新したか
5. **README.md** — 設定手順に影響する変更の場合、ドキュメントを更新したか

---

## 6. 新プロジェクト展開チェックリスト（要約）

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

*最終更新: 2026-03-15 — SpeedStar Dev Team*
