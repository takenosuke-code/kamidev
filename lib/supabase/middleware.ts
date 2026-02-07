import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT use getSession() - it reads from storage without validation
  // Use getUser() which validates the token with Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Debug logging
  console.log('[Middleware]', {
    pathname,
    hasUser: !!user,
    userId: user?.id,
  })

  // Allow auth callback route to process without interference
  if (pathname === '/auth/callback') {
    return supabaseResponse
  }

  // Auth routes - redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.includes(pathname)

  // Protected routes - require authentication
  const isProtectedRoute = pathname.startsWith('/dashboard')

  // RULE 1: Logged-in users visiting auth pages → redirect to dashboard
  if (user && isAuthRoute) {
    console.log('[Middleware] Redirecting logged-in user to dashboard')
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // RULE 2: Non-logged-in users visiting protected routes → redirect to login
  if (!user && isProtectedRoute) {
    console.log('[Middleware] Redirecting non-logged-in user to login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
