import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag, Music, Star, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function InformationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  let newsItem = null;
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      newsItem = data;
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
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-pink-200">
                <Image 
                  src="/images/logo_heart.png" 
                  alt="SugarNote Logo" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300" 
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ec4899'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-pink-500">SugarNote</span>
            </Link>
            <div className="flex items-center space-x-8">
               <Link href="/#information" className="text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors flex items-center gap-1">
                 <ChevronLeft className="w-4 h-4" /> 戻る
               </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 px-4 max-w-4xl mx-auto">
        <Link href="/#information" className="inline-flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors mb-8 group">
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          ニュース一覧へ戻る
        </Link>
        
        <article className="bg-white rounded-3xl p-6 md:p-12 shadow-[0_8px_30px_-10px_rgba(236,72,153,0.15)] border border-pink-100">
          <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-tight tracking-tight">
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
              prose-img:rounded-xl prose-img:shadow-md
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
                <Link key={item} href={`/#${item.toLowerCase()}`} className="hover:text-pink-400 transition-colors">{item}</Link>
              ))}
              {['DISCOGRAPHY', 'GOODS', 'FANCLUB', 'CONTACT'].map((item) => (
                <Link key={item} href={`/#${item.toLowerCase()}`} className="hover:text-pink-400 transition-colors">{item}</Link>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
            <div className="flex gap-4">
              <a href="#" className="hover:text-pink-400 transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-pink-400 transition-colors">利用規約</a>
              <a href="#" className="hover:text-pink-400 transition-colors">運営会社</a>
            </div>
            <p>© 2026 SugarNote Official. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
