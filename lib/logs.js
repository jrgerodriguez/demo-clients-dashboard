'use server'

import { createClient } from '@/lib/supabase/server'

export async function registrarLog(accion, detalles = null) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: perfil } = await supabase
      .from('usuarios_autorizados')
      .select('nombre')
      .eq('email', user.email)
      .maybeSingle()

    await supabase.from('logs').insert({
      usuario_email: user.email,
      usuario_nombre: perfil?.nombre || null,
      accion,
      detalles,
    })
  } catch {}
}

export async function obtenerLogs({ limite = 200, desde = null, hasta = null } = {}) {
  const supabase = await createClient()
  let query = supabase
    .from('logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limite)

  if (desde) query = query.gte('created_at', `${desde}T00:00:00`)
  if (hasta) query = query.lte('created_at', `${hasta}T23:59:59`)

  const { data: logs, error } = await query
  if (error) throw error

  const { data: usuarios } = await supabase
    .from('usuarios_autorizados')
    .select('email, nombre')

  const nombrePorEmail = {}
  usuarios?.forEach(u => { nombrePorEmail[u.email] = u.nombre })

  return logs.map(log => ({
    ...log,
    usuario_nombre: log.usuario_nombre || nombrePorEmail[log.usuario_email] || null,
  }))
}
