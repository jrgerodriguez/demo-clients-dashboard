import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TZ = 'America/El_Salvador'

function fechaManana(): string {
  const hoy = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
  hoy.setDate(hoy.getDate() + 1)
  const y = hoy.getFullYear()
  const m = String(hoy.getMonth() + 1).padStart(2, '0')
  const d = String(hoy.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatearHora(hora: string): string {
  const [h, m] = hora.split(':')
  const date = new Date()
  date.setHours(Number(h), Number(m))
  return date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
}

export async function GET() {
  try {
    const supabase = await createClient()
    const manana = fechaManana()

    const { data: citas, error } = await supabase
      .from('citas')
      .select('hora_inicio, clientes(nombre_completo), perros(nombre, raza)')
      .eq('fecha', manana)
      .eq('estado', 'pendiente')
      .order('hora_inicio', { ascending: true })

    if (error) throw error

    if (!citas || citas.length === 0) {
      return NextResponse.json({ ok: true, mensaje: 'Sin citas para mañana, no se envió mensaje.' })
    }

    const lineas = citas.map((c: any) => {
      const hora  = formatearHora(c.hora_inicio)
      const cliente = c.clientes?.nombre_completo || 'Cliente'
      const perro = c.perros ? ` — 🐾 ${c.perros.nombre}${c.perros.raza ? ` (${c.perros.raza})` : ''}` : ''
      return `  • ${hora} | ${cliente}${perro}`
    })

    const fecha = new Date(manana + 'T00:00:00').toLocaleDateString('es-SV', {
      weekday: 'long', day: 'numeric', month: 'long'
    })

    const mensaje =
      `📅 *Citas para mañana — ${fecha}*\n\n` +
      lineas.join('\n') +
      `\n\n Total: ${citas.length} cita${citas.length > 1 ? 's' : ''}`

    const phone  = process.env.CALLMEBOT_PHONE!
    const apikey = process.env.CALLMEBOT_APIKEY!
    const url    = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apikey}`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`CallMeBot respondió ${res.status}`)

    return NextResponse.json({ ok: true, citas: citas.length, fecha: manana })
  } catch (err: any) {
    console.error('Error notificacion-citas:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
