"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LANGS = [
  { code: "ja", label: "JP" },
  { code: "en", label: "EN" },
  { code: "th", label: "TH" },
] as const;

interface Props {
  currentLang: string;
}

export default function LanguageSwitcher({ currentLang }: Props) {
  const pathname = usePathname(); // e.g. /en/information/123

  const switchTo = (lang: string): string => {
    const segments = pathname.split("/");
    segments[1] = lang; // replace the locale segment
    return segments.join("/");
  };

  return (
    <div className="flex items-center gap-1 border border-pink-200 rounded-full px-1 py-1 bg-white/60">
      {LANGS.map(({ code, label }) => (
        <Link
          key={code}
          href={switchTo(code)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
            currentLang === code
              ? "bg-pink-500 text-white"
              : "text-slate-500 hover:text-pink-500"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
