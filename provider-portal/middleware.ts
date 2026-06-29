import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes: Admin, Doctor, Pharmacy, Clinic
  const protectedPaths = ['/admin', '/doctor', '/pharmacy', '/clinic']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected) {
    const hasSession = request.cookies.get('sessionToken')
    if (!hasSession) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
