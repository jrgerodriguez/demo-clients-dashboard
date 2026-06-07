import { Suspense } from 'react'
import { FiDollarSign, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi'
import { obtenerDatosContabilidad } from '@/lib/reportes'
import GraficaBarras from '@/app/components/reportes/GraficaBarras'
import GraficaTorta from '@/app/components/reportes/GraficaTorta'
import SelectorAño from '@/app/components/reportes/SelectorAño'

export default async function ContabilidadPage({ searchParams }) {
  const params = await searchParams
  const año = parseInt(params?.año) || new Date().getFullYear()
  const { ingresosPorMes, desglosePago, totalIngresos, totalCompletadas, totalPendientes, promedio } = await obtenerDatosContabilidad(año)

  const stats = [
    {
      label: 'Ingresos del Año',
      value: `$${totalIngresos.toLocaleString('es-SV', { minimumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Citas Cobradas',
      value: totalCompletadas,
      icon: FiCheckCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Citas Pendientes',
      value: totalPendientes,
      icon: FiClock,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Promedio por Cita',
      value: `$${promedio.toLocaleString('es-SV', { minimumFractionDigits: 2 })}`,
      icon: FiTrendingUp,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ]

  return (
    <div className="space-y-8 fade-in-up">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contabilidad</h1>
          <p className="text-slate-500 text-sm mt-1">Resumen de ingresos y pagos del año {año}.</p>
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
          <h2 className="text-sm font-bold text-slate-900 mb-1">Ingresos por Mes</h2>
          <p className="text-xs text-slate-400 mb-6">Solo citas completadas · {año}</p>
          <GraficaBarras data={ingresosPorMes} dataKey="ingresos" xKey="mes" color="#3b82f6" prefix="$" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Métodos de Pago</h2>
          <p className="text-xs text-slate-400 mb-6">Distribución de ingresos por método · {año}</p>
          <GraficaTorta data={desglosePago} />
        </div>

      </div>

      {/* Tabla resumen */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-5">Desglose mensual</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-4">Mes</th>
                <th className="pb-3 pr-4 text-right">Ingresos</th>
                <th className="pb-3 text-right">vs anterior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ingresosPorMes.map((row, i) => {
                const anterior = i > 0 ? ingresosPorMes[i - 1].ingresos : null
                const diff = anterior !== null && anterior > 0
                  ? ((row.ingresos - anterior) / anterior * 100).toFixed(0)
                  : null
                return (
                  <tr key={row.mes} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-800">{row.mes}</td>
                    <td className="py-3 pr-4 text-right font-bold text-slate-900">
                      ${row.ingresos.toLocaleString('es-SV', { minimumFractionDigits: 2 })}
                    </td>
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
