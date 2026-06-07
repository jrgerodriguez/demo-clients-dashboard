import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const { data: autorizado } = await supabase
          .from('usuarios_autorizados')
          .select('email')
          .eq('email', user.email)
          .maybeSingle()

        if (!autorizado) {
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/login?error=no_autorizado', origin))
        }
      }

      return NextResponse.redirect(new URL('/dashboard', origin))
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_error', origin))
}
