import type { Locale } from "@/dictionaries";

/**
 * A news item as returned by Supabase (includes i18n JSONB columns).
 */
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  title_i18n: Record<string, string> | null;
  content_i18n: Record<string, string> | null;
  published_on: string;
  published_at: string;
  category: string | null;
  image_url: string | null;
  status: string;
}

/**
 * Resolve the localized `title` and `content` for a news item.
 *
 * Fallback chain:
 *   title_i18n[lang]  →  title  (Japanese canonical)
 */
export function localizeNewsItem(item: NewsItem, lang: Locale): NewsItem {
  return {
    ...item,
    title:   item.title_i18n?.[lang]   ?? item.title,
    content: item.content_i18n?.[lang] ?? item.content,
  };
}

/**
 * Batch-localize an array of news items.
 */
export function localizeNewsItems(items: NewsItem[], lang: Locale): NewsItem[] {
  return items.map((item) => localizeNewsItem(item, lang));
}
