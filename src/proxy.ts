import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const locales = ["ja", "en", "th"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "ja";

/**
 * Detect the user's preferred locale from the Accept-Language header.
 * Priority: Thai → English → Japanese → default (ja)
 */
function detectLocale(acceptLanguage: string): Locale {
  const langs = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().toLowerCase());

  for (const lang of langs) {
    if (lang.startsWith("th")) return "th";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("ja")) return "ja";
  }
  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path already starts with a supported locale
  const firstSegment = pathname.split("/")[1];
  const hasLocale = (locales as readonly string[]).includes(firstSegment);

  if (!hasLocale) {
    // 2. No locale prefix — detect and redirect
    const acceptLanguage = request.headers.get("accept-language") ?? "";
    const locale = detectLocale(acceptLanguage);

    const url = request.nextUrl.clone();
    // "/" → "/ja", "/some/path" → "/ja/some/path"
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, { status: 307 });
  }

  // 3. Locale already present — run Supabase session update (handles /[lang]/admin auth guard)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.png, images/ (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|icon.png|sitemap.xml|robots.txt).*)",
  ],
};
