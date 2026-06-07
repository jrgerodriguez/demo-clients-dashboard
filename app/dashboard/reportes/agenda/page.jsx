import { Suspense } from 'react'
import { FiCalendar, FiTrendingUp, FiStar } from 'react-icons/fi'
import { obtenerDatosAgenda } from '@/lib/reportes'
import GraficaBarras from '@/app/components/reportes/GraficaBarras'
import SelectorAño from '@/app/components/reportes/SelectorAño'

export default async function AgendaPage({ searchParams }) {
  const params = await searchParams
  const año = parseInt(params?.año) || new Date().getFullYear()
  const { citasPorMes, citasPorDia, total, estesMes, diaOcupado } = await obtenerDatosAgenda(año)
  const promedioPorMes = total > 0 ? (total / 12).toFixed(1) : 0

  const stats = [
    {
      label: 'Citas en el Año',
      value: total,
      icon: FiCalendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Citas Este Mes',
      value: estesMes,
      icon: FiTrendingUp,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Promedio Mensual',
      value: promedioPorMes,
      icon: FiCalendar,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Día más Ocupado',
      value: diaOcupado,
      icon: FiStar,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  return (
    <div className="space-y-8 fade-in-up">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reporte de Agenda</h1>
          <p className="text-slate-500 text-sm mt-1">Análisis de citas y ocupación del año {año}.</p>
        </div>
        <Suspense fallback={null}>
          <SelectorAño año={año} />
        </Suspense>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              <Icon className={iconColor} size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Citas por Mes</h2>
          <p className="text-xs text-slate-400 mb-6">Todas las citas · {año}</p>
          <GraficaBarras data={citasPorMes} dataKey="citas" xKey="mes" color="#8b5cf6" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Citas por Día de la Semana</h2>
          <p className="text-xs text-slate-400 mb-6">¿Qué días son más ocupados? · {año}</p>
          <GraficaBarras data={citasPorDia} dataKey="citas" xKey="dia" color="#10b981" />
        </div>

      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-5">Citas por mes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-4">Mes</th>
                <th className="pb-3 pr-4 text-right">Citas</th>
                <th className="pb-3 text-right">vs anterior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {citasPorMes.map((row, i) => {
                const anterior = i > 0 ? citasPorMes[i - 1].citas : null
                const diff = anterior !== null && anterior > 0
                  ? ((row.citas - anterior) / anterior * 100).toFixed(0)
                  : null
                return (
                  <tr key={row.mes} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.mes}</td>
                    <td className="py-3 pr-4 text-right font-bold text-slate-900">{row.citas}</td>
                    <td className="py-3 text-right">
                      {diff !== null ? (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${Number(diff) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                          {Number(diff) >= 0 ? '+' : ''}{diff}%
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
