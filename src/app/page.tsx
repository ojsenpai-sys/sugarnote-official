import { createClient } from "@/lib/supabase/server";
import ClientPage from "@/components/ClientPage";

// Force dynamic rendering so we don't fetch from Supabase during build time
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();

  let siteSettings = null;
  let news = [];
  let discography = [];
  let goods = [];
  let videos = [];

  try {
    const results = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("news").select("*").eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(5),
      supabase.from("discography").select("*").order("release_date", { ascending: false }).limit(4),
      supabase.from("goods").select("*").order("created_at", { ascending: false }).limit(4),
      supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(1),
    ]);

    siteSettings = results[0].data;
    news = results[1].data || [];
    discography = results[2].data || [];
    goods = results[3].data || [];
    videos = results[4].data || [];
  } catch (err) {
    console.error("Fetch exception in Page.tsx:", err);
  }

  return (
    <ClientPage 
      siteSettings={siteSettings || {}}
      news={news || []}
      discography={discography || []}
      goods={goods || []}
      videos={videos || []}
    />
  );
}
