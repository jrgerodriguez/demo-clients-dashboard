import { Suspense } from 'react'
import RequiereAdmin from '@/app/components/auth/RequiereAdmin'
import { obtenerLogs } from '@/lib/logs'
import { FiActivity } from 'react-icons/fi'
import FiltroFechas from '@/app/components/logs/FiltroFechas'

const COLORES = {
  'Cliente creado':   'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cliente editado':  'bg-blue-50 text-blue-700 border-blue-200',
  'Cliente eliminado':'bg-red-50 text-red-700 border-red-200',
  'Cita creada':      'bg-violet-50 text-violet-700 border-violet-200',
  'Cita editada':     'bg-amber-50 text-amber-700 border-amber-200',
  'Cita eliminada':   'bg-red-50 text-red-700 border-red-200',
  'Usuario agregado': 'bg-sky-50 text-sky-700 border-sky-200',
  'Usuario eliminado':'bg-red-50 text-red-700 border-red-200',
  'Rol cambiado':     'bg-slate-100 text-slate-700 border-slate-200',
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString('es-SV', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'America/El_Salvador'
  })
}

export default async function LogsPage({ searchParams }) {
  return (
    <RequiereAdmin>
      <LogsContent searchParams={searchParams} />
    </RequiereAdmin>
  )
}

async function LogsContent({ searchParams }) {
  const params = await searchParams
  const desde  = params?.desde || null
  const hasta  = params?.hasta || null

  const logs = await obtenerLogs({ desde, hasta })

  return (
    <div className="space-y-6 fade-in-up">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <FiActivity className="text-slate-600" size={18} />
            </div>
            Registro de Actividad
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {logs.length} {logs.length === 1 ? 'registro' : 'registros'}
            {desde || hasta ? ' · filtrado por fecha' : ''}
          </p>
        </div>
        <Suspense fallback={null}>
          <FiltroFechas desde={desde} hasta={hasta} />
        </Suspense>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <FiActivity className="text-slate-300" size={22} />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {desde || hasta ? 'Sin actividad en el rango seleccionado' : 'No hay actividad registrada aún'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Acción</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Detalle</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${COLORES[log.accion] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {log.accion}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{log.detalles || '—'}</td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="font-medium text-slate-700">{log.usuario_nombre || log.usuario_email}</span>
                      {log.usuario_nombre && <span className="block text-slate-400">{log.usuario_email}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatFecha(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}
