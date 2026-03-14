import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { localizeNewsItem } from "@/lib/localize";
import { getDictionary } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import { ChevronLeft, Calendar, Tag, Music, Star, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function InformationDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  const supabase = await createClient();
  const dict = await getDictionary(lang);

  let newsItem = null;
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*, title_i18n, content_i18n")
      .eq("id", id)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .single();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      // Resolve title / content to the requested language (falls back to Japanese)
      newsItem = localizeNewsItem(data, lang as Locale);
    }
  } catch (err) {
    console.error("Fetch exception in InformationDetailPage:", err);
  }

  if (!newsItem) {
    notFound();
  }

  // Tiptap outputs standard HTML, which we can safely render via dangerouslySetInnerHTML
  // because the content is managed by site admins through a secure CMS.
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 text-slate-800 font-sans pb-24">
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href={`/${lang}`} className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-pink-200">
                <Image 
                  src="/images/logo_heart.png" 
                  alt="SugarNote Logo" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-pink-500">SugarNote</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href={`/${lang}#information`} className="text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> {dict.detail.back}
              </Link>
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 px-4 max-w-4xl mx-auto">
        <Link href={`/${lang}#information`} className="inline-flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          {dict.detail.backToList}
        </Link>
        
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-[0_8px_30px_-10px_rgba(236,72,153,0.15)] border border-pink-100">
          <header className="mb-8 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span>{newsItem.published_on}</span>
              </div>
              {newsItem.category && (
                <div className="flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-600 text-xs font-black tracking-wider rounded-full">
                  <Tag className="w-3 h-3" />
                  {newsItem.category}
                </div>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-pink-400 leading-relaxed tracking-normal font-sans">
              {newsItem.title}
            </h1>
          </header>

          {newsItem.image_url && (
            <div className="mb-10 relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
              <Image 
                src={newsItem.image_url} 
                alt={newsItem.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-lg prose-pink max-w-none text-slate-700
              prose-a:text-pink-500 prose-a:font-bold hover:prose-a:text-pink-600
              prose-img:rounded-xl prose-img:shadow-md prose-img:w-full prose-img:max-w-2xl prose-img:mx-auto prose-img:block prose-img:h-auto
              prose-headings:text-slate-800 prose-headings:font-bold prose-headings:tracking-tight
              prose-strong:text-slate-800
              prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: newsItem.content || "" }}
          />
        </article>
      </div>

       {/* Footer */}
       <footer className="bg-slate-900 pt-20 pb-10 text-slate-400 relative border-t-4 border-pink-500 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-16">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
                <Star className="h-6 w-6 text-pink-500 fill-pink-500" />
                <span className="font-extrabold text-2xl tracking-tighter text-white">SugarNote</span>
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-center md:text-left text-sm font-bold tracking-widest">
              {['INFORMATION', 'SCHEDULE', 'PROFILE', 'VIDEO'].map((item) => (
                <Link key={item} href={`/${lang}#${item.toLowerCase()}`} className="hover:text-pink-400 transition-colors">{item}</Link>
              ))}
              {['DISCOGRAPHY', 'GOODS', 'FANCLUB', 'CONTACT'].map((item) => (
                <Link key={item} href={`/${lang}#${item.toLowerCase()}`} className="hover:text-pink-400 transition-colors">{item}</Link>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-400 transition-colors">{dict.footer.privacy}</a>
              <a href="#" className="hover:text-pink-400 transition-colors">{dict.footer.terms}</a>
              <a href="#" className="hover:text-pink-400 transition-colors">{dict.footer.company}</a>
            </div>
            <p>{dict.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
