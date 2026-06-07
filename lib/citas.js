'use server'

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { registrarLog } from "@/lib/logs"

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
                estado: data.estado || 'pendiente',
                costo: data.costo ? parseFloat(data.costo) : null
            }
        ])
        .select()
        .single()

    if (error) throw error
    await registrarLog('Cita creada', `Cliente ID: ${data.cliente_id} — ${data.fecha} ${data.hora_inicio}`)
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
            estado: data.estado,
            costo: data.costo ? parseFloat(data.costo) : null
        })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    await registrarLog('Cita editada', `ID: ${id} — ${data.fecha} ${data.hora_inicio}`)
    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
    return cita
}

export async function obtenerIngresosDelMes() {
    const hoy = new Date()
    const primerDia = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-01`
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    const fechaFin = `${ultimoDia.getFullYear()}-${String(ultimoDia.getMonth() + 1).padStart(2, '0')}-${String(ultimoDia.getDate()).padStart(2, '0')}`

    const { data, error } = await supabase
        .from('citas')
        .select('costo')
        .gte('fecha', primerDia)
        .lte('fecha', fechaFin)
        .eq('estado', 'completado')

    if (error) throw error
    return data.reduce((sum, cita) => sum + (Number(cita.costo) || 0), 0)
}

export async function obtenerCitasHoyConteo() {
    const hoy = new Date()
    const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

    const { count, error } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .eq('fecha', fechaHoy)

    if (error) throw error
    return count || 0
}

export async function obtenerProximasCitas(limite = 5) {
    const hoy = new Date()
    const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

    const { data, error } = await supabase
        .from('citas')
        .select('*, clientes(nombre_completo)')
        .gte('fecha', fechaHoy)
        .order('fecha', { ascending: true })
        .order('hora_inicio', { ascending: true })
        .limit(limite)

    if (error) throw error
    return data
}

export async function eliminarCita(id) {
    const { error } = await supabase
        .from("citas")
        .delete()
        .eq("id", id)

    if (error) throw error
    await registrarLog('Cita eliminada', `ID: ${id}`)
    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
}
