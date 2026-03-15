import type { Metadata } from "next";
import { Inter, Noto_Sans_JP, Noto_Sans_Thai } from "next/font/google";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

// ── per-locale OG locale codes ──────────────────────────────────────────────
const ogLocale: Record<string, string> = {
  ja: "ja_JP",
  en: "en_US",
  th: "th_TH",
};

// ── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { url, name, ogImage, descriptions, keywords, authors, creator, publisher, twitterHandle } = siteConfig;

  const desc = descriptions[lang] ?? descriptions[siteConfig.defaultLocale];

  return {
    metadataBase: new URL(url),

    // ── Basic ──────────────────────────────────────────────────────────────
    title: {
      default: `${name} Official Website`,
      template: `%s | ${name} Official`,
    },
    description: desc,
    keywords: [...keywords],
    authors: [...authors],
    creator,
    publisher,
    formatDetection: { email: false, address: false, telephone: false },

    // ── hreflang / canonical ────────────────────────────────────────────────
    alternates: {
      canonical: `${url}/${lang}`,
      languages: Object.fromEntries([
        ...siteConfig.locales.map((l) => [l, `${url}/${l}`]),
        ["x-default", `${url}/${siteConfig.defaultLocale}`],
      ]),
    },

    // ── Open Graph ─────────────────────────────────────────────────────────
    openGraph: {
      title: `${name} Official Website`,
      description: desc,
      url: `${url}/${lang}`,
      siteName: `${name} Official`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} Main Visual` }],
      locale: ogLocale[lang] ?? "ja_JP",
      type: "website",
    },

    // ── Twitter / X ────────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: `${name} Official Website`,
      description: desc,
      images: [ogImage],
      creator: twitterHandle,
    },

    // ── Icons ──────────────────────────────────────────────────────────────
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    },
  };
}

// ── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return siteConfig.locales.map((lang) => ({ lang }));
}

// ── Layout ───────────────────────────────────────────────────────────────────
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      {/*
        Font CSS variables are injected on <body> so they are available
        to all children in the cascade.
        --font-inter          : Latin / English
        --font-noto-sans-jp   : Japanese
        --font-noto-sans-thai : Thai (activated via :lang(th) in globals.css)
      */}
      <body
        className={`${inter.variable} ${notoSansJP.variable} ${notoSansThai.variable} antialiased min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
