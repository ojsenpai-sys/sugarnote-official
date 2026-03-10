import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ja', 'en', 'th'],
 
  // Used when no locale matches
  defaultLocale: 'ja',
  
  // Custom domains or pathnames can be configured here if necessary
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
