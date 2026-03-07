import { createClient } from "@/lib/supabase/server";
import ClientPage from "@/components/ClientPage";

// Force dynamic rendering so we don't fetch from Supabase during build time
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();

  const [
    { data: siteSettings },
    { data: news },
    { data: discography },
    { data: goods },
    { data: videos }
  ] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase.from("news").select("*").order("published_on", { ascending: false }).limit(5),
    supabase.from("discography").select("*").order("release_date", { ascending: false }).limit(4),
    supabase.from("goods").select("*").order("created_at", { ascending: false }).limit(4),
    supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(1),
  ]);

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
