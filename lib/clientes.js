'use server'

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function obtenerClientes() {
    const {data, error} = await supabase.from('clientes').select("*")
    if(error) throw error;
    return data
}

export default async function crearNuevoCliente(data) {
    const {data: cliente, error} = await supabase
        .from("clientes")
        .insert([
            {
            nombre_completo: data.nombre,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
            notas: data.notas
        },
    ])
    .select()
    .single();

    if(error) {
        throw error;
    }

    revalidatePath('/dashboard/clientes');
    revalidatePath('/dashboard');
    return cliente;

}

export async function obtenerClientePorId(id) {
    const {data, error} = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return null;
  }

  return data
} 

export async function editarCliente(id, data) {
  const { data: cliente, error } = await supabase
    .from("clientes")
    .update({
      nombre_completo: data.nombre,
      telefono: data.telefono,
      email: data.email,
      direccion: data.direccion,
      notas: data.notas,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/dashboard/clientes');
  revalidatePath(`/dashboard/clientes/${id}`);
  revalidatePath('/dashboard');
  return cliente;
}

export async function eliminarClientePorId(clienteId) {
  // 1. Eliminar primero todas las citas de este cliente
  const { error: errorCitas } = await supabase
    .from('citas')
    .delete()
    .eq('cliente_id', clienteId)
  
  if (errorCitas) throw errorCitas

  // 2. Eliminar al cliente
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', clienteId)

    if (error) throw error

    revalidatePath('/dashboard/clientes');
    revalidatePath('/dashboard/calendario');
    revalidatePath('/dashboard');
}

export async function obtenerConteoClientesActivos() {
    const { data, error } = await supabase
        .from('citas')
        .select('cliente_id')
    
    if (error) throw error
  
    const uniqueClients = new Set(data.map(c => c.cliente_id))
    return uniqueClients.size
}
  
export async function obtenerTotalClientes() {
    const { count, error } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
  
    if (error) throw error
    return count || 0
}

export async function obtenerClientesInactivos() {
    // Clientes que no han tenido citas en los últimos 30 días,
    // pero que han tenido al menos una cita antes de eso.
    const treintaDiasAtras = new Date()
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30)
    const fechaStr = treintaDiasAtras.toISOString().split('T')[0]

    // 1. Obtener todas las citas para determinar la última actividad de cada uno
    const { data: todasLasCitas, error: errCitas } = await supabase
        .from('citas')
        .select('cliente_id, fecha')
        .order('fecha', { ascending: false })
    
    if (errCitas) throw errCitas

    const ultimaCitaPorCliente = {}
    todasLasCitas.forEach(cita => {
        if (!ultimaCitaPorCliente[cita.cliente_id]) {
            ultimaCitaPorCliente[cita.cliente_id] = cita.fecha
        }
    })

    // 2. Obtener todos los clientes
    const { data: todosLosClientes, error: errClientes } = await supabase
        .from('clientes')
        .select('*')
    
    if (errClientes) throw errClientes

    // 3. Filtrar: Inactivos que han tenido alguna cita pero hace más de 30 días
    return todosLosClientes
        .map(cliente => ({
            ...cliente,
            ultima_cita: ultimaCitaPorCliente[cliente.id] || null
        }))
        .filter(cliente => {
            if (!cliente.ultima_cita) return false // Solo los que han tenido cita alguna vez
            return cliente.ultima_cita < fechaStr
        })
        .sort((a, b) => b.ultima_cita.localeCompare(a.ultima_cita)) // Más reciente primero
}

