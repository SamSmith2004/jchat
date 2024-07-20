import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAuthenticated = !!token
  const isLoginPage = req.nextUrl.pathname === '/';

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/home', req.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If authenticated, update user status to online
  if (isAuthenticated && token.sub) { // 'sub' is usually the user ID in JWT
    try {
      await fetch('http://localhost:8080/api/user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: token.sub, status: 'online' }),
      })
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Exclude API routes and static assets
}