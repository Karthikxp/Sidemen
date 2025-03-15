import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname;

  // If it's the dashboard path and no authentication
  if (path.startsWith('/dashboard')) {
    const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only on dashboard routes
export const config = {
  matcher: '/dashboard/:path*'
}; 