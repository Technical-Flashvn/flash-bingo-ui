// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/mil-bingo'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const currentPath = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (accessToken && currentPath === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}