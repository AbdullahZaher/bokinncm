import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/rooms',
    '/bookings',
    '/calendar',
    '/integrations',
    '/analytics',
    '/admin',
    '/settings'
  ]

  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/rooms/:path*',
    '/bookings/:path*',
    '/calendar/:path*',
    '/integrations/:path*',
    '/analytics/:path*',
    '/admin/:path*',
    '/settings/:path*'
  ]
} 