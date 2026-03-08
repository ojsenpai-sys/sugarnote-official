import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} Official Website`,
    template: `%s | ${siteConfig.name} Official`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.credits.music.map((m) => ({ name: `${m} (Music Production)` })).concat(
    { name: siteConfig.credits.management },
    { name: `${siteConfig.credits.visual} (Visual Direction)` }
  ),
  creator: `${siteConfig.name} Project`,
  publisher: `${siteConfig.name} Publisher`,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: `${siteConfig.name} Official Website`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: `${siteConfig.name} Official`,
    images: [
      {
        url: "/images/group_main.jpg",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} Main Visual`,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Official Website`,
    description: siteConfig.description,
    images: ["/images/group_main.jpg"],
    creator: siteConfig.links.twitter ? `@${siteConfig.links.twitter.split('/').pop()}` : undefined,
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
  // Inject the theme colors as CSS variables dynamically from siteConfig
  const themeStyles = {
    "--theme-primary": siteConfig.themeColor.primary,
    "--theme-secondary": siteConfig.themeColor.secondary,
    "--theme-accent": siteConfig.themeColor.accent,
    "--theme-background": siteConfig.themeColor.background,
    "--theme-surface": siteConfig.themeColor.surface,
    "--theme-surface-muted": siteConfig.themeColor.surfaceMuted,
  } as React.CSSProperties;

  return (
    <html lang="ja">
      <body 
        className={`${montserrat.variable} ${notoSansJP.variable} antialiased min-h-screen font-sans`}
        style={themeStyles}
      >
        {children}
      </body>
    </html>
  );
}
