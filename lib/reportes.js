'use server'

import { supabase } from '@/lib/supabase'

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

export async function obtenerDatosContabilidad(año = new Date().getFullYear()) {
    const { data, error } = await supabase
        .from('citas')
        .select('fecha, costo, metodo_pago, estado')
        .gte('fecha', `${año}-01-01`)
        .lte('fecha', `${año}-12-31`)

    if (error) throw error

    const completadas = data.filter(c => c.estado === 'completado')
    const pendientes  = data.filter(c => c.estado === 'pendiente')

    const ingresosPorMes = MESES.map((mes, i) => {
        const total = completadas
            .filter(c => parseInt(c.fecha.split('-')[1]) === i + 1)
            .reduce((sum, c) => sum + (Number(c.costo) || 0), 0)
        return { mes, ingresos: total }
    })

    const porMetodo = {}
    completadas.forEach(c => {
        const m = c.metodo_pago || 'efectivo'
        porMetodo[m] = (porMetodo[m] || 0) + (Number(c.costo) || 0)
    })
    const desglosePago = Object.entries(porMetodo).map(([name, value]) => ({ name, value }))

    const totalIngresos   = completadas.reduce((sum, c) => sum + (Number(c.costo) || 0), 0)
    const promedio        = completadas.length > 0 ? totalIngresos / completadas.length : 0

    return {
        ingresosPorMes,
        desglosePago,
        totalIngresos,
        totalCompletadas: completadas.length,
        totalPendientes:  pendientes.length,
        promedio,
    }
}

export async function obtenerDatosAgenda(año = new Date().getFullYear()) {
    const { data, error } = await supabase
        .from('citas')
        .select('fecha')
        .gte('fecha', `${año}-01-01`)
        .lte('fecha', `${año}-12-31`)

    if (error) throw error

    const citasPorMes = MESES.map((mes, i) => ({
        mes,
        citas: data.filter(c => parseInt(c.fecha.split('-')[1]) === i + 1).length,
    }))

    const citasPorDia = DIAS.map((dia, i) => ({
        dia,
        citas: data.filter(c => {
            const [y, m, d] = c.fecha.split('-').map(Number)
            return new Date(y, m - 1, d).getDay() === i
        }).length,
    }))

    const total        = data.length
    const mesActual    = new Date().getMonth()
    const estesMes     = data.filter(c => parseInt(c.fecha.split('-')[1]) === mesActual + 1).length
    const diaOcupado   = [...citasPorDia].sort((a, b) => b.citas - a.citas)[0]?.dia ?? '-'

    return { citasPorMes, citasPorDia, total, estesMes, diaOcupado }
}
