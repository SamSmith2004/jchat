// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) // get token from request
  const isAuthenticated = !!token // check if user is authenticated by checking if token exists
  const isLoginPage = req.nextUrl.pathname === '/';

  if (isLoginPage) {
    if (isAuthenticated) { 
      return NextResponse.redirect(new URL('/home', req.url))
    }
    return NextResponse.next() // continue to the next middleware
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
  // match all routes except /api, /_next/static, /_next/image, and /favicon.ico
}