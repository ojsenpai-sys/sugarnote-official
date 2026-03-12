import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // protect /[lang]/admin routes (e.g. /ja/admin, /en/admin/news)
  const segments = request.nextUrl.pathname.split("/");
  const langSegment = segments[1] ?? "ja"; // e.g. "ja", "en", "th"
  const isAdminRoute = segments[2] === "admin";
  const isLoginPage = segments[2] === "admin" && segments[3] === "login";

  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${langSegment}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  // bypass login page if already authenticated
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${langSegment}/admin`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
