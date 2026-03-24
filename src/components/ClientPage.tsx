"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Disc,
  Mail,
  Menu,
  MessageSquare,
  Music,
  PlayCircle,
  ShoppingBag,
  Star,
  X,
  Instagram,
  Twitter,
  Youtube
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { submitContactForm } from "@/app/actions/contact";
import type { Dictionary } from "@/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { MEMBERS_META } from "@/constants/members";
import { siteConfig } from "@/config/site";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
);


interface ClientPageProps {
  siteSettings: any;
  news: any[];
  discography: any[];
  goods: any[];
  videos: any[];
  dict: Dictionary;
}

export default function ClientPage({ siteSettings, news, discography, goods, videos, dict }: ClientPageProps) {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang ?? "ja";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { key: "information", label: dict.nav.information },
    { key: "schedule",    label: dict.nav.schedule },
    { key: "profile",     label: dict.nav.profile },
    { key: "video",       label: dict.nav.video },
    { key: "discography", label: dict.nav.discography },
    { key: "goods",       label: dict.nav.goods },
    { key: "contact",     label: dict.nav.contact },
  ];

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[フロントエンド] 送信ボタンが押されました");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      console.log("[フロントエンド] Server Action を呼び出します...");
      const result = await submitContactForm(formData);
      console.log("[フロントエンド] Server Action レスポンス:", result);

      if (result.success) {
        toast.success(result.message);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("[フロントエンド] 例外エラー発生:", err);
      toast.error("サーバーとの通信エラーが発生しました。");
    } finally {
      setIsSubmitting(false);
      console.log("[フロントエンド] 送信プロセス終了");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 text-slate-800 font-sans">
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center gap-2 group">
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
              <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-pink-500">SugarNote</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ key, label }) => (
                <Link key={key} href={`#${key}`} className="text-sm font-bold text-slate-600 hover:text-pink-500 transition-colors tracking-widest">
                  {label}
                </Link>
              ))}
            </div>

            {/* Language Switcher (desktop) */}
            <div className="hidden md:flex items-center">
              <LanguageSwitcher currentLang={lang} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <LanguageSwitcher currentLang={lang} />
              <button onClick={toggleMenu} className="text-pink-500 hover:text-pink-600 focus:outline-none">
                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-pink-100"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
              {navItems.map(({ key, label }) => (
                <Link
                  key={key}
                  href={`#${key}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-4 text-base font-bold text-slate-600 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors text-center tracking-widest"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-pink-100 pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={siteSettings?.hero_image_url || "/images/group_main.jpg"}
            alt="SugarNote Main Image"
            fill
            className="object-cover object-top opacity-90"
            priority
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23fbcfe8'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23be185d' text-anchor='middle'%3EHero Image: /images/group_main.jpg%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-100/80 via-transparent to-black/20" />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="absolute z-10 left-0 right-0 mx-auto px-4 text-center w-full max-w-7xl top-[75%] -translate-y-1/2 md:top-[46%]"
        >
          <div className="relative w-[95vw] scale-[1.25] md:scale-100 md:w-[1000px] mx-auto aspect-[3/1]">
            <Image
              src="/images/logo_ribbon.png"
              alt="SugarNote Logo"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold tracking-widest drop-shadow-md">{dict.hero.scroll}</span>
            <div className="w-[1px] h-12 bg-white/50 relative overflow-hidden">
              <motion.div
                className="w-full h-1/2 bg-white absolute top-0"
                animate={{ top: ["-50%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Concept Text */}
      <section className="py-20 px-4 bg-white text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mb-8">
            <Star className="w-8 h-8 text-white fill-white p-1" />
          </div>
          <h2 className="text-xl md:text-4xl font-semibold font-sans text-pink-500 mb-8 leading-relaxed tracking-wide">
            {dict.concept.tagline}
          </h2>
          <p className="text-base md:text-2xl text-slate-700 leading-loose font-medium font-sans px-4">
            {dict.concept.description.split("\n").map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br className="hidden md:block" />}</span>
            ))}
          </p>
        </motion.div>
      </section>

      {/* Information Section */}
      <section id="information" className="py-24 px-4 bg-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader title={dict.information.title} subtitle={dict.information.subtitle} icon={<Music className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {news.map((item) => (
              <motion.div key={item.id} variants={fadeIn}>
                <Link href={`/${lang}/information/${item.id}`} className="block group bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(236,72,153,0.15)] hover:shadow-[0_8px_30px_-10px_rgba(236,72,153,0.2)] transition-all border border-pink-100/50 cursor-pointer flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <span className="text-slate-500 font-medium text-sm">{item.published_on}</span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-600 text-[10px] font-black tracking-wider rounded-full">{item.category || "NEWS"}</span>
                  </div>
                  <p className="font-bold text-slate-800 lg:text-lg group-hover:text-pink-500 transition-colors flex-grow">
                    {item.title}
                  </p>
                  <div className="hidden md:block">
                    <ChevronRight className="w-5 h-5 text-pink-300 group-hover:text-pink-500 transition-colors group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-12 text-center">
            <ButtonOutline>{dict.information.viewAll}</ButtonOutline>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 px-4 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title={dict.schedule.title} subtitle={dict.schedule.subtitle} icon={<Calendar className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-3xl p-2 md:p-6 shadow-xl shadow-pink-100/50 border border-pink-50 w-full overflow-hidden"
          >
            {/* Explicit height avoids aspect-ratio:0 bugs on some browsers */}
            <div className="w-full h-[480px] md:h-[620px] bg-slate-50 rounded-2xl overflow-hidden border border-pink-100">
              <iframe
                src={(() => {
                  const pink = "F9A8D4";
                  let base = siteSettings?.timetree_url || "https://timetreeapp.com/public_calendars/sugarnote_ofc/widget";
                  if (base.includes("frame_color=")) {
                    return base.replace(/frame_color=%23[a-fA-F0-9]{6}/i, `frame_color=%23${pink}`);
                  }
                  return base + (base.includes("?") ? "&" : "?") + `frame_color=%23${pink}`;
                })()}
                style={{ border: 0 }}
                width="100%"
                height="100%"
                title="SugarNote Schedule"
                allow="fullscreen"
                loading="lazy"
                className="w-full h-full bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="py-24 px-4 bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader title={dict.profile.title} subtitle={dict.profile.subtitle} icon={<Star className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8"
          >
            {dict.members.map((member) => {
              const meta = MEMBERS_META[member.id]!;
              return (
              <motion.div
                key={member.id}
                variants={fadeIn}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-pink-100/50 border border-pink-50 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-pink-100">
                  <Image
                    src={meta.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23fbcfe8'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' fill='%23be185d' text-anchor='middle'%3EPhoto: " + member.name + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 w-full p-6 text-white text-left">
                    <p className="text-[10px] sm:text-xs font-bold tracking-widest text-pink-300 mb-1">{member.kana}</p>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{member.name}</h3>
                  </div>
                </div>

                <div className="p-6 bg-white flex flex-col gap-4 text-sm font-medium text-slate-600">
                  <div>
                    <span className="text-xs text-pink-400 font-bold block mb-1">{dict.profile.birth}</span>
                    <p className="text-slate-800">{member.birth} / {member.origin}</p>
                  </div>
                  <div>
                    <span className="text-xs text-pink-400 font-bold block mb-1">{dict.profile.mbti}</span>
                    <p className="text-slate-800">{member.mbti}</p>
                  </div>
                  <div>
                    <span className="text-xs text-pink-400 font-bold block mb-1">{dict.profile.experience}</span>
                    <p className="text-slate-800">{member.experience}</p>
                  </div>

                  <div className="flex gap-3 justify-start mt-2">
                    {meta.sns?.tiktok && (
                      <a href={meta.sns.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                        <TikTokIcon className="w-4 h-4" />
                      </a>
                    )}
                    {meta.sns?.instagram && (
                      <a href={meta.sns.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {meta.sns?.x && (
                      <a href={meta.sns.x} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="py-24 px-4 bg-white relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title={dict.video.title} subtitle={dict.video.subtitle} icon={<PlayCircle className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-pink-200/40 relative aspect-video"
          >
            {videos.length > 0 && videos[0].youtube_id ? (
              <iframe src={`https://www.youtube.com/embed/${videos[0].youtube_id}`} title={videos[0].title} className="absolute inset-0 w-full h-full border-0" allowFullScreen></iframe>
            ) : (
              <div className="absolute inset-0 bg-pink-900/10 flex items-center justify-center border border-pink-100">
                <div className="text-center group cursor-pointer">
                  <div className="w-20 h-20 bg-pink-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/50">
                    <PlayCircle className="w-10 h-10 text-white fill-white translate-x-1" />
                  </div>
                  <p className="text-slate-500 font-bold">{dict.video.noVideo}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Discography Section */}
      <section id="discography" className="py-24 px-4 bg-pink-50 relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title={dict.discography.title} subtitle={dict.discography.subtitle} icon={<Disc className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {discography.length > 0 ? discography.map((item) => (
              <motion.div key={item.id} variants={fadeIn} className="flex gap-6 bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-pink-100">
                <div className="w-32 h-32 bg-pink-200 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden relative">
                   {item.cover_url ? (
                     <Image src={item.cover_url} alt={item.title} fill className="object-cover" />
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-rose-300 opacity-80 mix-blend-overlay"></div>
                       <Disc className="w-12 h-12 text-white/50" />
                     </>
                   )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-pink-500 mb-1">{dict.discography.digitalSingle}</span>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{item.release_date} {dict.discography.release}</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-pink-500 transition-colors">{dict.discography.listen}</button>
                    <button className="px-4 py-1.5 bg-pink-50 text-pink-600 text-xs font-bold rounded-full hover:bg-pink-100 transition-colors">{dict.discography.detail}</button>
                  </div>
                </div>
              </motion.div>
            )) : <div className="col-span-1 md:col-span-2 text-center text-slate-400 font-bold py-12">{dict.discography.comingSoon}</div>}
          </motion.div>
          <div className="mt-12 text-center">
            <ButtonOutline>{dict.discography.viewAll}</ButtonOutline>
          </div>
        </div>
      </section>

      {/* Goods Section */}
      <section id="goods" className="py-24 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title={dict.goods.title} subtitle={dict.goods.subtitle} icon={<ShoppingBag className="w-6 h-6 text-pink-500" />} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {goods.length > 0 ? goods.map((item) => {
              const raw = item.store_url ?? "";
              const storeHref = raw
                ? /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
                : null;
              console.log(`[Goods] id=${item.id} name="${item.name}" store_url="${raw}" → resolved="${storeHref ?? "(none)"}"`);
              const cardInner = (
                <>
                  <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden border border-slate-100">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ShoppingBag className="w-12 h-12 text-slate-300 group-hover:text-pink-400 group-hover:scale-110 transition-all duration-300 z-10" />
                      </>
                    )}
                    {item.is_sold_out && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center"><span className="bg-red-500 text-white font-black px-4 py-2 rounded-lg text-sm rotate-[-15deg] shadow-lg border-2 border-white">{dict.goods.soldOut}</span></div>}
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-800 group-hover:text-pink-500 transition-colors line-clamp-2">{item.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">¥{item.price.toLocaleString()}</p>
                  {storeHref && (
                    <a
                      href={storeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-pink-500 hover:text-pink-700 transition-colors"
                    >
                      ショップで見る <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </>
              );
              return storeHref ? (
                <motion.a
                  key={item.id}
                  href={storeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeIn}
                  className="group cursor-pointer block"
                >
                  {cardInner}
                </motion.a>
              ) : (
                <motion.div key={item.id} variants={fadeIn} className="group block">
                  {cardInner}
                </motion.div>
              );
            }) : <div className="col-span-4 text-center text-slate-400">{dict.goods.comingSoon}</div>}
          </motion.div>
          <div className="mt-12 text-center">
            <a
              href={siteSettings?.shopify_url || "#"}
              target={siteSettings?.shopify_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-xl shadow-slate-900/20 tracking-widest"
            >
              {dict.goods.officialStore} <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">{dict.contact.title}</h2>
            <p className="text-pink-100 font-medium tracking-widest">{dict.contact.subtitle}</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.contact.name} <span className="text-pink-500">{dict.contact.required}</span></label>
                  <input type="text" name="name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" placeholder={dict.contact.namePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.contact.company}</label>
                  <input type="text" name="company_name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" placeholder={dict.contact.companyPlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{dict.contact.email} <span className="text-pink-500">{dict.contact.required}</span></label>
                  <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" placeholder={dict.contact.emailPlaceholder} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{dict.contact.type} <span className="text-pink-500">{dict.contact.required}</span></label>
                <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all appearance-none">
                  <option value={dict.contact.types.performance}>{dict.contact.types.performance}</option>
                  <option value={dict.contact.types.media}>{dict.contact.types.media}</option>
                  <option value={dict.contact.types.fanmail}>{dict.contact.types.fanmail}</option>
                  <option value={dict.contact.types.other}>{dict.contact.types.other}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{dict.contact.message} <span className="text-pink-500">{dict.contact.required}</span></label>
                <textarea name="message" required rows={5} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none" placeholder={dict.contact.messagePlaceholder}></textarea>
              </div>
              <div className="text-center pt-4">
                <button type="submit" disabled={isSubmitting} className="px-12 py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-pink-500/30 w-full md:w-auto tracking-widest flex items-center justify-center gap-2 mx-auto disabled:hover:scale-100 disabled:cursor-not-allowed">
                  <MessageSquare className="w-5 h-5" /> {isSubmitting ? dict.contact.submitting : dict.contact.submit}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 text-slate-400 relative border-t-4 border-pink-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-16">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
                <Star className="h-6 w-6 text-pink-500 fill-pink-500" />
                <span className="font-extrabold text-2xl tracking-tighter text-white">SugarNote</span>
              </div>
              <div className="flex gap-4 justify-center md:justify-start">
                <a href={siteConfig.sns.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href={siteConfig.sns.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href={siteConfig.sns.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-slate-300">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-center md:text-left text-sm font-bold tracking-widest">
              {(['information', 'schedule', 'profile', 'video'] as const).map((key) => (
                <Link key={key} href={`#${key}`} className="hover:text-pink-400 transition-colors">{dict.nav[key]}</Link>
              ))}
              {(['discography', 'goods'] as const).map((key) => (
                <Link key={key} href={`#${key}`} className="hover:text-pink-400 transition-colors">{dict.nav[key]}</Link>
              ))}
              <Link href="#fanclub" className="hover:text-pink-400 transition-colors">FANCLUB</Link>
              <Link href="#contact" className="hover:text-pink-400 transition-colors">{dict.nav.contact}</Link>
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

// Reusable Components
function SectionHeader({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      className="text-center mb-16"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        {icon}
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">
          {title}
        </h2>
      </div>
      <p className="text-pink-500 font-bold tracking-widest text-sm md:text-base">{subtitle}</p>
    </motion.div>
  );
}

function ButtonOutline({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-8 py-3 bg-white hover:bg-pink-50 text-pink-600 border-2 border-pink-200 rounded-full font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mx-auto tracking-widest">
      {children} <ChevronRight className="w-4 h-4" />
    </button>
  );
}
