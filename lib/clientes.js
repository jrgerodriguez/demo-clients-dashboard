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
    // Clientes cuya última cita fue hace más de 30 días
    const hoy = new Date()
    const treintaDiasAtras = new Date(hoy)
    treintaDiasAtras.setDate(hoy.getDate() - 30)
    
    // Formato local YYYY-MM-DD para comparar con la DB
    const year = treintaDiasAtras.getFullYear()
    const month = String(treintaDiasAtras.getMonth() + 1).padStart(2, '0')
    const day = String(treintaDiasAtras.getDate()).padStart(2, '0')
    const fechaLimite = `${year}-${month}-${day}`

    const hoyStr = hoy.toISOString().split('T')[0]

    // 1. Obtener todas las citas con datos de clientes
    const { data: todasLasCitas, error: errCitas } = await supabase
        .from('citas')
        .select('*, clientes(*)')
        .order('fecha', { ascending: false })
    
    if (errCitas) throw errCitas

    // 2. Determinar cuáles clientes están REALMENTE activos (tienen cita en los últimos 30 días o futura)
    const clientesActivos = new Set()
    todasLasCitas.forEach(cita => {
        if (cita.fecha >= fechaLimite) {
            clientesActivos.add(cita.cliente_id)
        }
    })

    // 3. Filtrar citas: Todas las que son antiguas (> 30 días) de clientes que NO están activos actualmente
    // Opcionalmente, si el usuario quiere VER TODA CITA ANTIGUA indistintamente:
    const citasInactivas = todasLasCitas.filter(cita => {
        return cita.fecha < fechaLimite && !clientesActivos.has(cita.cliente_id)
    })

    // Mapeamos para que la UI reciba objetos que pueda renderizar (usamos la estructura que esperaba de cliente)
    return citasInactivas.map(cita => ({
        ...cita.clientes,
        ultima_cita: cita.fecha, // Usamos la fecha de ESTA cita como "ultima" para el renderizado
        cita_id: cita.id
    }))
}


