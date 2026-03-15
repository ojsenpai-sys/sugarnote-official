import { createClient } from "@/lib/supabase/server";
import ClientPage from "@/components/ClientPage";
import { localizeNewsItems } from "@/lib/localize";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/dictionaries";

// Force dynamic rendering so we don't fetch from Supabase during build time
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createClient();
  const dict = await getDictionary(lang);

  let siteSettings = null;
  let news: any[] = [];
  let discography: any[] = [];
  let goods: any[] = [];
  let videos: any[] = [];

  try {
    const results = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase
        .from("news")
        .select("*, title_i18n, content_i18n")
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("discography")
        .select("*")
        .order("release_date", { ascending: false })
        .limit(4),
      supabase
        .from("goods")
        .select("*")
        .order("sort_order", { ascending: true })
        .limit(4),
      supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    siteSettings  = results[0].data;
    // Resolve title / content to the requested language (falls back to Japanese)
    news          = localizeNewsItems(results[1].data ?? [], lang as Locale);
    discography   = results[2].data ?? [];
    goods         = results[3].data ?? [];
    videos        = results[4].data ?? [];
  } catch (err) {
    console.error("Fetch exception in Page.tsx:", err);
  }

  return (
    <ClientPage
      siteSettings={siteSettings ?? {}}
      news={news}
      discography={discography}
      goods={goods}
      videos={videos}
      dict={dict}
    />
  );
}
