import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    const errorMessage = errorDescription || '認証に失敗しました。もう一度お試しください。'
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('認証に失敗しました。もう一度お試しください。')}`, requestUrl.origin)
      )
    }

    // Successful authentication - redirect to intended destination
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
