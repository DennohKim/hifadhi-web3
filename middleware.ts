import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

export async function middleware(request: NextRequest) {
  const privyToken = request.cookies.get('privy-token')

  // If no token exists, allow access to the page
  if (!privyToken) {
    return NextResponse.next()
  }

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!)

  try {
    await client.verifyAuthToken(privyToken.value)
    // If token is valid, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    // If token is invalid, clear the cookie and continue
    const response = NextResponse.next()
    response.cookies.delete('privy-token')
    return response
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/',  // Only run middleware on home page
}