import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const proxyConfig = {
  // Match only internationalized pathnames
  // Ignore next specific files, public files, API routes, and the /admin panel
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)', '/(ja|en|th)/:path*']
};
