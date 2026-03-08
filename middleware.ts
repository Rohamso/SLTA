import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fa'],
  defaultLocale: 'en'
});

const DASHBOARD_PATH_REGEX = /^\/(en|fa)\/dashboard(?:\/|$)/;

function parseBasicAuth(authHeader: string | null): { username: string; password: string } | null {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const encoded = authHeader.slice(6).trim();
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const dashboardPassword = process.env.DASHBOARD_PASSWORD;

  if (DASHBOARD_PATH_REGEX.test(pathname)) {
    if (!dashboardPassword) {
      return new NextResponse('Dashboard access is disabled. Set DASHBOARD_PASSWORD on the server.', {
        status: 503,
      });
    }

    const credentials = parseBasicAuth(request.headers.get('authorization'));
    if (!credentials || credentials.password !== dashboardPassword) {
      return new NextResponse('Authentication required.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="SLTA Dashboard", charset="UTF-8"',
        },
      });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
