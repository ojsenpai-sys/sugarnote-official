/**
 * site.ts — Single source of truth for all site-specific configuration.
 *
 * When deploying this template for a new artist / idol group, edit ONLY
 * this file (plus the dictionary JSON files for localised strings and
 * src/constants/members.ts for member data).  Everything else adapts
 * automatically.
 */

export const siteConfig = {
  // ── Identity ──────────────────────────────────────────────────────────────
  /** Displayed name (Latin / brand) */
  name: "SugarNote",
  /** Displayed name (Japanese) */
  nameKana: "シュガーノート",
  /** Core tagline used in SEO and concept section */
  tagline: "Pure. Bright. Unstoppable.",
  /** Production / live domain — override via NEXT_PUBLIC_SITE_URL env var */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sugarnote.jp",

  // ── Group-level SNS ───────────────────────────────────────────────────────
  /** Replace # with actual URLs before launch */
  sns: {
    youtube:   "https://www.youtube.com/@SugarNote_OFC",
    twitter:   "https://x.com/sugarnote_ofc?s=21",
    instagram: "https://www.instagram.com/sugarnote_ofc?igsh=MTFyMThqaHhkd2kzag%3D%3D&utm_source=qr",
  },

  // ── SEO / Metadata ────────────────────────────────────────────────────────
  /** Twitter/X handle used in twitter:creator meta tag */
  twitterHandle: "@sugarnote_ofc",
  /** Default OG / Twitter card image (relative to /public) */
  ogImage: "/images/group_main.jpg",

  /** Per-locale meta descriptions */
  descriptions: {
    ja: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループSugarNote（シュガーノート）のオフィシャルサイト。",
    en: "SugarNote — a Japanese idol group expressing creativity rooted in the spirit of Japan. Pure. Bright. Unstoppable.",
    th: "SugarNote — กลุ่มไอดอลญี่ปุ่นที่สร้างสรรค์ผลงานโดยยึดจิตวิญญาณของชาวญี่ปุ่นเป็นแกนหลัก Pure. Bright. Unstoppable.",
  } as Record<string, string>,

  /** SEO keywords (Japanese primary + English) */
  keywords: [
    "SugarNote",
    "シュガーノート",
    "アイドル",
    "idol",
    "オフィシャルサイト",
    "坂東日奈多",
    "西条藍里",
    "白咲里莉穂",
    "櫻井那奈子",
    "坂東楓夏",
  ],

  // ── Credits (shown in <meta name="author">) ───────────────────────────────
  authors: [
    { name: "SugarNote Management" },
    { name: "ANCHOR (Music Production)" },
    { name: "中村泰輔 (Music Production)" },
    { name: "LINDO (Visual Direction)" },
  ],
  creator:   "SugarNote Project",
  publisher: "SugarNote Publisher",

  // ── Supported locales ─────────────────────────────────────────────────────
  locales:       ["ja", "en", "th"] as const,
  defaultLocale: "ja" as const,
} as const;

export type SiteLocale = typeof siteConfig.locales[number];
