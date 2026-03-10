import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Ignore next specific files, public files, API routes, and the /admin panel
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)', '/(ja|en|th)/:path*']
};
