import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RequiereAdmin({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('usuarios_autorizados')
    .select('rol')
    .eq('email', user.email)
    .maybeSingle()

  if (data?.rol !== 'admin') redirect('/dashboard')

  return children
}
