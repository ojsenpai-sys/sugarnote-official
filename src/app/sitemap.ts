import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sugarnote.jp";

const LOCALES = ["ja", "en", "th"] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Build the alternates.languages object for a given path segment.
 * Each entry links to the equivalent page in all three locales + x-default.
 *
 * path: "" for top page, "/information/[id]" for detail pages.
 */
function buildAlternates(path: string): Record<string, string> {
  const result: Record<string, string> = { "x-default": `${BASE_URL}/ja${path}` };
  for (const lang of LOCALES) {
    result[lang] = `${BASE_URL}/${lang}${path}`;
  }
  return result;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── 1. Static top-level pages (one per locale) ──────────────────────────
  const staticEntries: MetadataRoute.Sitemap = LOCALES.map((lang) => ({
    url:             `${BASE_URL}/${lang}`,
    lastModified:    new Date(),
    changeFrequency: "daily" as const,
    priority:        lang === "ja" ? 1.0 : 0.9,
    alternates: { languages: buildAlternates("") },
  }));

  // ── 2. Dynamic news detail pages ─────────────────────────────────────────
  const { data: newsItems, error } = await supabaseAdmin
    .from("news")
    .select("id, published_at, updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[sitemap] Failed to fetch news:", error.message);
  }

  const newsEntries: MetadataRoute.Sitemap = [];

  for (const item of newsItems ?? []) {
    const lastMod = new Date(item.updated_at ?? item.published_at);
    const path    = `/information/${item.id}`;

    // Emit one entry per locale so Google indexes each language version
    for (const lang of LOCALES) {
      newsEntries.push({
        url:             `${BASE_URL}/${lang}${path}`,
        lastModified:    lastMod,
        changeFrequency: "monthly" as const,
        priority:        0.8,
        alternates: { languages: buildAlternates(path) },
      });
    }
  }

  return [...staticEntries, ...newsEntries];
}
