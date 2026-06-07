'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { registrarLog } from '@/lib/logs'

export async function obtenerUsuarios() {
  const { data, error } = await supabase
    .from('usuarios_autorizados')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function agregarUsuario(email, rol = 'user', nombre = null) {
  const { error } = await supabase
    .from('usuarios_autorizados')
    .insert({ email, rol, nombre })
  if (error) throw error
  await registrarLog('Usuario agregado', `${email} (${rol})`)
  revalidatePath('/dashboard/configuracion')
}

export async function eliminarUsuario(email) {
  const { error } = await supabase
    .from('usuarios_autorizados')
    .delete()
    .eq('email', email)
  if (error) throw error
  await registrarLog('Usuario eliminado', email)
  revalidatePath('/dashboard/configuracion')
}

export async function cambiarRol(email, nuevoRol) {
  const { error } = await supabase
    .from('usuarios_autorizados')
    .update({ rol: nuevoRol })
    .eq('email', email)
  if (error) throw error
  await registrarLog('Rol cambiado', `${email} → ${nuevoRol}`)
  revalidatePath('/dashboard/configuracion')
}
