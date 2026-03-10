import type { Metadata } from "next";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { Montserrat, Noto_Sans_JP, Sarabun } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Concept' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    title: {
      default: "SugarNote Official Website",
      template: "%s | SugarNote Official",
    },
    description: t('description'),
    keywords: ["SugarNote", "シュガーノート", "アイドル", "オフィシャルサイト", "坂東日奈多", "西条藍里", "白咲里莉穂", "櫻井那奈子", "坂東楓夏"],
    authors: [
      { name: "SugarNote Management" },
      { name: "ANCHOR (Music Production)" },
      { name: "中村泰輔 (Music Production)" },
      { name: "LINDO (Visual Direction)" }
    ],
    creator: "SugarNote Project",
    publisher: "SugarNote Publisher",
    openGraph: {
      title: "SugarNote Official Website",
      description: t('description'),
      url: "https://sugarnote.jp",
      siteName: "SugarNote Official",
      images: [
        {
          url: "/images/group_main.jpg",
          width: 1200,
          height: 630,
          alt: "SugarNote Main Visual",
        },
      ],
      locale: locale === 'ja' ? 'ja_JP' : locale === 'th' ? 'th_TH' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SugarNote Official Website",
      description: t('description'),
      images: ["/images/group_main.jpg"],
      creator: "@SugarNote_Info", // Dummy ID
    },
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  // Use Sarabun if Thai, otherwise default NotoSans
  const fontClass = locale === 'th' 
    ? `${sarabun.variable} font-sans` 
    : `${notoSansJP.variable} font-sans`;

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} ${fontClass} antialiased min-h-screen`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
