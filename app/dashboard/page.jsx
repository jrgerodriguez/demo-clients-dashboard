import { FiUsers, FiTrendingUp, FiActivity, FiCalendar, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import Link from 'next/link'
import { obtenerConteoClientesActivos, obtenerTotalClientes } from '@/lib/clientes'

const quickLinks = [
  { href: '/dashboard/clientes',   label: 'Ver Clientes',   desc: 'Gestiona tu base de datos', icon: FiUsers,     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   hover: 'hover:bg-blue-100' },
  { href: '#',                      label: 'Reportes',       desc: 'Analiza tus métricas',       icon: FiTrendingUp,color: 'text-emerald-600',bg: 'bg-emerald-50',border: 'border-emerald-100',hover: 'hover:bg-emerald-100' },
  { href: '/dashboard/calendario', label: 'Calendario',     desc: 'Organiza tus citas',         icon: FiCalendar,  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', hover: 'hover:bg-violet-100' },
]

export default async function DashboardPage() {
  const totalClientes = await obtenerTotalClientes()
  const clientesActivos = await obtenerConteoClientesActivos()

  const stats = [
    {
      label: 'Total Clientes',
      value: totalClientes.toLocaleString(),
      change: '+12%',
      icon: FiUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Clientes Activos',
      value: clientesActivos.toLocaleString(),
      change: 'Activos',
      icon: FiCheckCircle,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Actividad',
      value: '892',
      change: '+15%',
      icon: FiActivity,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Citas Hoy',
      value: '24',
      change: '+5%',
      icon: FiCalendar,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="space-y-8 fade-in-up">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Bienvenido de vuelta. Aquí está el resumen del día.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
        {stats.map(({ label, value, change, icon: Icon, iconBg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200 fade-in-up"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className={iconColor} size={20} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${label === 'Clientes Activos' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-emerald-600 bg-emerald-50 border border-emerald-100'}`}>
                {change}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-slate-900">Acceso Rápido</h2>
          <span className="text-xs text-slate-400">Acciones frecuentes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                <p className={`text-sm font-semibold text-slate-800 group-hover:${color} transition-colors`}>{label}</p>
                <p className="text-xs text-slate-500 truncate">{desc}</p>
              </div>
              <FiArrowUpRight className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" size={16} />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

