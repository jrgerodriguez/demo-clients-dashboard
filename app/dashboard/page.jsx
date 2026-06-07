import { FiUsers, FiCalendar, FiArrowUpRight, FiCheckCircle, FiUserX, FiClock, FiDollarSign, FiUserPlus } from 'react-icons/fi'
import Link from 'next/link'
import { obtenerConteoClientesActivos, obtenerTotalClientes, obtenerConteoClientesInactivos, obtenerClientesNuevosEsteMes } from '@/lib/clientes'
import { obtenerCitasHoyConteo, obtenerProximasCitas, obtenerIngresosDelMes } from '@/lib/citas'

const quickLinks = [
  { href: '/dashboard/clientes',            label: 'Ver Clientes',   desc: 'Gestiona tu base de datos', icon: FiUsers,      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   hover: 'hover:bg-blue-100' },
  { href: '/dashboard/clientes-inactivos',  label: 'Inactivos',      desc: 'Clientes sin actividad',    icon: FiUserX,      color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100',  hover: 'hover:bg-amber-100' },
  { href: '/dashboard/calendario',          label: 'Calendario',     desc: 'Organiza tus citas',        icon: FiCalendar,   color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:bg-violet-100' },
]

function formatFecha(fecha) {
  const [year, month, day] = fecha.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const hoy = new Date()
  const esHoy = date.toDateString() === hoy.toDateString()
  const manana = new Date(hoy); manana.setDate(hoy.getDate() + 1)
  const esManana = date.toDateString() === manana.toDateString()
  if (esHoy) return 'Hoy'
  if (esManana) return 'Mañana'
  return date.toLocaleDateString('es-SV', { day: 'numeric', month: 'short' })
}

function formatHora(hora) {
  if (!hora) return ''
  const [h, m] = hora.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

export default async function DashboardPage() {
  const [totalClientes, clientesActivos, clientesInactivos, citasHoy, proximasCitas, ingresosDelMes, clientesNuevos] = await Promise.all([
    obtenerTotalClientes(),
    obtenerConteoClientesActivos(),
    obtenerConteoClientesInactivos(),
    obtenerCitasHoyConteo(),
    obtenerProximasCitas(5),
    obtenerIngresosDelMes(),
    obtenerClientesNuevosEsteMes(),
  ])

  const stats = [
    {
      label: 'Total Clientes',
      value: totalClientes.toLocaleString(),
      icon: FiUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: null,
    },
    {
      label: 'Clientes Activos',
      value: clientesActivos.toLocaleString(),
      icon: FiCheckCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      badge: { label: 'Activos', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    },
    {
      label: 'Clientes Inactivos',
      value: clientesInactivos.toLocaleString(),
      icon: FiUserX,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      badge: { label: 'Ver', href: '/dashboard/clientes-inactivos', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    },
    {
      label: 'Citas Hoy',
      value: citasHoy.toLocaleString(),
      icon: FiCalendar,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      badge: { label: 'Hoy', color: 'text-violet-600 bg-violet-50 border-violet-100' },
    },
    {
      label: 'Ingresos del Mes',
      value: `$${ingresosDelMes.toLocaleString('es-SV', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      badge: { label: 'Este mes', color: 'text-green-600 bg-green-50 border-green-100' },
    },
    {
      label: 'Clientes Nuevos',
      value: clientesNuevos.toLocaleString(),
      icon: FiUserPlus,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      badge: { label: 'Este mes', color: 'text-sky-600 bg-sky-50 border-sky-100' },
    },
  ]

  return (
    <div className="space-y-8 fade-in-up">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Bienvenido de vuelta. Aquí está el resumen del día.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor, badge }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className={iconColor} size={20} />
              </div>
              {badge && (
                badge.href ? (
                  <Link href={badge.href} className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.color} hover:opacity-80 transition-opacity`}>
                    {badge.label}
                  </Link>
                ) : (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                )
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Próximas citas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Próximas Citas</h2>
            <Link href="/dashboard/calendario" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver calendario <FiArrowUpRight size={12} />
            </Link>
          </div>
          {proximasCitas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <FiCalendar className="text-slate-300" size={20} />
              </div>
              <p className="text-sm font-medium text-slate-500">No hay citas próximas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximasCitas.map((cita) => (
                <Link
                  key={cita.id}
                  href={`/dashboard/clientes/${cita.cliente_id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                    <FiClock className="text-violet-500" size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {cita.clientes?.nombre_completo}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatHora(cita.hora_inicio)}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0">
                    {formatFecha(cita.fecha)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Acceso rápido */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Acceso Rápido</h2>
            <span className="text-xs text-slate-400">Acciones frecuentes</span>
          </div>
          <div className="flex flex-col gap-3">
            {quickLinks.map(({ href, label, desc, icon: Icon, color, bg, border, hover }) => (
              <Link
                key={label}
                href={href}
                className={`group flex items-center gap-4 p-4 rounded-lg border ${border} ${bg} ${hover} transition-all duration-150`}
              >
                <div className={`w-9 h-9 rounded-lg bg-white border ${border} flex items-center justify-center shadow-sm shrink-0`}>
                  <Icon className={color} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{desc}</p>
                </div>
                <FiArrowUpRight className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" size={16} />
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
