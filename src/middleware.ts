import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

const PUBLIC_FILE = /\.(.*)$/

export default async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  const res = NextResponse.next()
  const locale = req.cookies.get('NEXT_LOCALE')?.value || req.nextUrl.locale
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url))
  }

  return res
}
export const config = {
  matcher: ['/'],
}
