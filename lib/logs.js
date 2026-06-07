'use server'

import { createClient } from '@/lib/supabase/server'

export async function registrarLog(accion, detalles = null) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('logs').insert({
      usuario_email: user.email,
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

  const { data, error } = await query
  if (error) throw error
  return data
}
