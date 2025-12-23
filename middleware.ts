import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 未認証でログインページ以外にアクセスした場合、ログインページにリダイレクト
  if (!user && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url))
    // クッキーを引き継ぐ
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // 認証済みでログインページにアクセスした場合、ダッシュボードにリダイレクト
  if (user && request.nextUrl.pathname.startsWith('/admin/login')) {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url))
    // クッキーを引き継ぐ
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: '/admin/:path*',
}
