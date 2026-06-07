'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function obtenerPerrosPorCliente(clienteId) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('perros')
    .select('*')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function crearPerro(data) {
  const supabase = await createClient()
  const { data: perro, error } = await supabase
    .from('perros')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  revalidatePath('/dashboard/clientes')
  return perro
}

export async function editarPerro(id, data) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('perros')
    .update(data)
    .eq('id', id)
  if (error) throw error
  revalidatePath('/dashboard/clientes')
}

export async function eliminarPerro(id) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('perros')
    .delete()
    .eq('id', id)
  if (error) throw error
  revalidatePath('/dashboard/clientes')
}
