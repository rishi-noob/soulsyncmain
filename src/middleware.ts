
import {NextRequest, NextResponse} from 'next/server';

const PROTECTED_ROUTES = {
  '/admin': ['admin', 'management'],
  '/admin/moderation': ['admin', 'management'],
  '/admin/users': ['admin', 'management'],
  '/volunteer': ['admin', 'management', 'volunteer'],
};

const ROUTES = Object.keys(PROTECTED_ROUTES);

export function middleware(request: NextRequest) {
  const sessionUserCookie = request.cookies.get('soul-sync-session-user');
  let userRole = 'student'; // Default to least privileged role

  if (sessionUserCookie) {
    try {
      const user = JSON.parse(sessionUserCookie.value);
      if (user && user.role) {
        userRole = user.role;
      }
    } catch (e) {
      // Invalid JSON in cookie, treat as unauthenticated
      userRole = 'student';
    }
  }

  const {pathname} = request.nextUrl;

  // Check if the user is trying to access a protected route
  const protectedRoute = ROUTES.find(route => pathname.startsWith(route));

  if (protectedRoute) {
    const allowedRoles = PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES];
    if (!allowedRoles.includes(userRole)) {
      // If user's role is not allowed, redirect to their dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', '/volunteer/:path*'],
};
