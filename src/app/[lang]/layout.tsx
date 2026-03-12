import type { Metadata } from "next";
import { Montserrat, Noto_Sans_JP, Noto_Sans_Thai } from "next/font/google";

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

// ── per-locale descriptions ──────────────────────────────────────────────────
const descriptions: Record<string, string> = {
  ja: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループSugarNote（シュガーノート）のオフィシャルサイト。",
  en: "SugarNote — a Japanese idol group expressing creativity rooted in the spirit of Japan. Pure. Bright. Unstoppable.",
  th: "SugarNote — กลุ่มไอดอลญี่ปุ่นที่สร้างสรรค์ผลงานโดยยึดจิตวิญญาณของชาวญี่ปุ่นเป็นแกนหลัก Pure. Bright. Unstoppable.",
};

// ── generateMetadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sugarnote.jp";

  const desc = descriptions[lang] ?? descriptions.ja;

  return {
    metadataBase: new URL(baseUrl),

    // ── Basic ──────────────────────────────────────────────────────────────
    title: {
      default: "SugarNote Official Website",
      template: "%s | SugarNote Official",
    },
    description: desc,
    keywords: [
      "SugarNote",
      "シュガーノート",
      "アイドル",
      "idol",
      "オフィシャルサイト",
      "坂東日奈多",
      "西条藍里",
      "白咲里莉穂",
      "櫻井那奈子",
      "坂東楓夏",
    ],
    authors: [
      { name: "SugarNote Management" },
      { name: "ANCHOR (Music Production)" },
      { name: "中村泰輔 (Music Production)" },
      { name: "LINDO (Visual Direction)" },
    ],
    creator: "SugarNote Project",
    publisher: "SugarNote Publisher",
    formatDetection: { email: false, address: false, telephone: false },

    // ── hreflang / canonical ────────────────────────────────────────────────
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        ja:          `${baseUrl}/ja`,
        en:          `${baseUrl}/en`,
        th:          `${baseUrl}/th`,
        "x-default": `${baseUrl}/ja`,
      },
    },

    // ── Open Graph ─────────────────────────────────────────────────────────
    openGraph: {
      title: "SugarNote Official Website",
      description: desc,
      url: `${baseUrl}/${lang}`,
      siteName: "SugarNote Official",
      images: [
        {
          url: "/images/group_main.jpg",
          width: 1200,
          height: 630,
          alt: "SugarNote Main Visual",
        },
      ],
      locale: ogLocale[lang] ?? "ja_JP",
      type: "website",
    },

    // ── Twitter / X ────────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: "SugarNote Official Website",
      description: desc,
      images: ["/images/group_main.jpg"],
      creator: "@SugarNote_Info",
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
  return [{ lang: "ja" }, { lang: "en" }, { lang: "th" }];
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
    <html
      lang={lang}
      suppressHydrationWarning
      // CSS variables for all three fonts are always available;
      // :lang(th) in globals.css uses --font-noto-sans-thai automatically.
      className={`${montserrat.variable} ${notoSansJP.variable} ${notoSansThai.variable}`}
    >
      <body className="antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
