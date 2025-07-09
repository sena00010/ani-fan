// /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth kontrolü gerektiren rotalar
  const protectedPaths = [
    '/profile/',
    '/community/profile/',
    '/community/post/',
    '/community/page/'
  ];
  
  const path = request.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp));
  
  // Tokenı kontrol et
  const token = request.cookies.get('mconnect_login_token')?.value;
  
 // Auth gerektiren bir sayfa ve token yoksa, ana sayfaya yönlendir
  if (isProtectedPath && !token) {
    console.log(isProtectedPath,"isProtectedPath","token",token)
    return NextResponse.redirect(new URL('/', request.url));

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/profile/:path*',
    '/community/profile/:path*', 
    // '/community/post/:path*',
    // '/community/page/:path*',
  ],
};