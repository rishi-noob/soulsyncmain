
import {NextRequest, NextResponse} from 'next/server';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin', 'management'],
  '/volunteer': ['admin', 'management', 'volunteer'],
};

// This matcher will protect all routes under /admin and /volunteer
const protectedPaths = Object.keys(PROTECTED_ROUTES);

export function middleware(request: NextRequest) {
  const sessionUserCookie = request.cookies.get('soul-sync-session-user');
  let userRole: string | null = null;

  if (sessionUserCookie) {
    try {
      const user = JSON.parse(sessionUserCookie.value);
      if (user && user.role) {
        userRole = user.role;
      }
    } catch (e) {
      // Invalid JSON in cookie, treat as unauthenticated
      userRole = null;
    }
  }

  const {pathname} = request.nextUrl;

  const protectedRoute = protectedPaths.find(route => pathname.startsWith(route));

  if (protectedRoute) {
    const allowedRoles = PROTECTED_ROUTES[protectedRoute];
    if (!userRole || !allowedRoles.includes(userRole)) {
      // If user is not logged in or their role is not allowed, redirect to their dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/volunteer/:path*'],
};
