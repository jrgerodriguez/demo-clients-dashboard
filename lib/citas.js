'use server'

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { registrarLog } from "@/lib/logs"

const TZ = 'America/El_Salvador'
const fechaLocal = () => new Date().toLocaleDateString('sv', { timeZone: TZ })

export async function obtenerTodasLasCitas() {
    const { data, error } = await supabase
        .from("citas")
        .select("*, clientes(nombre_completo), perros(nombre, raza)")
        .order("fecha", { ascending: true })

    if (error) throw error
    return data
}

export async function obtenerCitasPorCliente(clienteId) {
    const { data, error } = await supabase
        .from("citas")
        .select("*, perros(nombre, raza)")
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
                perro_id: data.perro_id || null,
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

    const { data: cliente } = await supabase
        .from('clientes')
        .select('nombre_completo')
        .eq('id', data.cliente_id)
        .maybeSingle()
    await registrarLog('Cita creada', `${cliente?.nombre_completo || data.cliente_id} — ${data.fecha} ${data.hora_inicio}`)

    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
    return cita
}

export async function editarCita(id, data) {
    const { data: cita, error } = await supabase
        .from("citas")
        .update({
            perro_id: data.perro_id || null,
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

    const { data: cliente } = await supabase
        .from('clientes')
        .select('nombre_completo')
        .eq('id', cita.cliente_id)
        .maybeSingle()
    await registrarLog('Cita editada', `${cliente?.nombre_completo || id} — ${data.fecha} ${data.hora_inicio}`)

    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
    return cita
}

export async function obtenerIngresosDelMes() {
    const hoyStr = fechaLocal()
    const [year, month] = hoyStr.split('-').map(Number)
    const primerDia = `${year}-${String(month).padStart(2, '0')}-01`
    const ultimoDiaNum = new Date(year, month, 0).getDate()
    const fechaFin = `${year}-${String(month).padStart(2, '0')}-${String(ultimoDiaNum).padStart(2, '0')}`

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
    const fechaHoy = fechaLocal()

    const { count, error } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .eq('fecha', fechaHoy)

    if (error) throw error
    return count || 0
}

export async function obtenerProximasCitas(limite = 5) {
    const fechaHoy = fechaLocal()

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
    const { data: citaExistente } = await supabase
        .from('citas')
        .select('cliente_id, fecha, hora_inicio, clientes(nombre_completo)')
        .eq('id', id)
        .maybeSingle()

    const { error } = await supabase
        .from("citas")
        .delete()
        .eq("id", id)

    if (error) throw error

    const nombre = citaExistente?.clientes?.nombre_completo || id
    const fecha  = citaExistente ? `${citaExistente.fecha} ${citaExistente.hora_inicio}` : ''
    await registrarLog('Cita eliminada', `${nombre}${fecha ? ' — ' + fecha : ''}`)

    revalidatePath('/dashboard/calendario')
    revalidatePath('/dashboard/clientes-inactivos')
    revalidatePath('/dashboard')
}
