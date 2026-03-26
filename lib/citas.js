'use server'

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function obtenerTodasLasCitas() {
    const { data, error } = await supabase
        .from("citas")
        .select("*, clientes(nombre_completo)")
        .order("fecha", { ascending: true })

    if (error) throw error
    return data
}

export async function obtenerCitasPorCliente(clienteId) {
    const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("fecha", { ascending: false })

    if (error) throw error
    return data
}

export async function crearCita(data) {
    const { data: cita, error } = await supabase
        .from("citas")
        .insert([
            {
                cliente_id: data.cliente_id,
                fecha: data.fecha,
                hora_inicio: data.hora_inicio,
                duracion: parseInt(data.duracion),
                notas: data.notas,
                metodo_pago: data.metodo_pago,
                estado: data.estado || 'pendiente'
            }
        ])
        .select()
        .single()

    if (error) throw error
    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
    return cita
}

export async function editarCita(id, data) {
    const { data: cita, error } = await supabase
        .from("citas")
        .update({
            fecha: data.fecha,
            hora_inicio: data.hora_inicio,
            duracion: parseInt(data.duracion),
            notas: data.notas,
            metodo_pago: data.metodo_pago,
            estado: data.estado
        })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
    return cita
}

export async function eliminarCita(id) {
    const { error } = await supabase
        .from("citas")
        .delete()
        .eq("id", id)

    if (error) throw error
    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
}
