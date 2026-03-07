import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SugarNote Official Website",
    template: "%s | SugarNote Official",
  },
  description: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループSugarNote（シュガーノート）のオフィシャルサイト。",
  keywords: ["SugarNote", "シュガーノート", "アイドル", "オフィシャルサイト", "坂東ひなた", "西条藍里", "白咲里莉穂", "櫻井那奈子", "坂東楓夏"],
  authors: [
    { name: "SugarNote Management" },
    { name: "ANCHOR (Music Production)" },
    { name: "中村泰輔 (Music Production)" },
    { name: "LINDO (Visual Direction)" }
  ],
  creator: "SugarNote Project",
  publisher: "SugarNote Publisher",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SugarNote Official Website",
    description: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループ。",
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
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SugarNote Official Website",
    description: "「Pure. Bright. Unstoppable.」日本人の精神性を主軸に、緻密で繊細なクリエイティブを展開するアイドルグループ。",
    images: ["/images/group_main.jpg"],
    creator: "@SugarNote_Info", // Dummy ID
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import { Montserrat, Noto_Sans_JP } from "next/font/google";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${montserrat.variable} ${notoSansJP.variable} antialiased min-h-screen font-sans`}>
        {children}
      </body>
    </html>
  );
}
