import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'fr', 'ar', 'tz'];
const defaultLocale = 'en';

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  try {
    const preferredLocales = acceptLanguage
      .split(',')
      .map((lang) => {
        const [locale, q] = lang.split(';q=');
        return {
          locale: locale.trim().split('-')[0].toLowerCase(),
          q: q ? parseFloat(q) : 1.0,
        };
      })
      .sort((a, b) => b.q - a.q);

    for (const preferred of preferredLocales) {
      if (locales.includes(preferred.locale)) {
        return preferred.locale;
      }
    }
  } catch (e) {
    // Fallback if parsing fails
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check if pathname has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const segments = pathname.split('/');
    const lang = segments[1];
    const isAr = lang === 'ar';
    const direction = isAr ? 'rtl' : 'ltr';

    const response = NextResponse.next();
    response.headers.set('X-Layout-Direction', direction);
    response.headers.set('x-lang', lang);
    return response;
  }

  // Get preferred locale for redirecting
  const locale = getPreferredLocale(request);

  // Handle redirects for old legacy URL patterns to ensure SEO continuity
  let targetPath = pathname;

  if (pathname === '/') {
    // Root path: redirect to localized root
    targetPath = `/${locale}`;
  } else if (pathname.startsWith('/p/')) {
    // Old product route: /p/[id] -> /[lang]/listing/[id]
    const productId = pathname.substring(3);
    targetPath = `/${locale}/listing/${productId}`;
  } else if (pathname.startsWith('/store/')) {
    // Old store route: /store/[slug] -> /[lang]/shop/[slug]
    const storeSlug = pathname.substring(7);
    targetPath = `/${locale}/shop/${storeSlug}`;
  } else if (pathname.startsWith('/categories/')) {
    // Old categories route: /categories/[slug] -> /[lang]/category/[slug]
    const catSlug = pathname.substring(12);
    targetPath = `/${locale}/category/${catSlug}`;
  } else {
    // General route: prepend preferred locale
    targetPath = `/${locale}${pathname}`;
  }

  const redirectUrl = new URL(`${targetPath}${search}`, request.url);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, static files (assets, favicon, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
