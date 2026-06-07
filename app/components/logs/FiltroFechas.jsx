'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import { FiCalendar, FiX } from 'react-icons/fi'

export default function FiltroFechas({ desde, hasta }) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const desdeRef    = useRef(null)
  const hastaRef    = useRef(null)

  function aplicar(nuevoDesde, nuevoHasta) {
    const params = new URLSearchParams(searchParams)
    if (nuevoDesde) params.set('desde', nuevoDesde)
    else params.delete('desde')
    if (nuevoHasta) params.set('hasta', nuevoHasta)
    else params.delete('hasta')
    router.push(`${pathname}?${params.toString()}`)
  }

  function limpiar() {
    desdeRef.current.value = ''
    hastaRef.current.value = ''
    router.push(pathname)
  }

  const hayFiltro = desde || hasta

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
        <FiCalendar size={14} className="text-slate-400 shrink-0" />
        <input
          ref={desdeRef}
          type="date"
          defaultValue={desde || ''}
          onChange={e => aplicar(e.target.value, hastaRef.current?.value)}
          className="text-sm text-slate-700 bg-transparent focus:outline-none"
        />
        <span className="text-slate-300 text-xs">—</span>
        <input
          ref={hastaRef}
          type="date"
          defaultValue={hasta || ''}
          onChange={e => aplicar(desdeRef.current?.value, e.target.value)}
          className="text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>
      {hayFiltro && (
        <button
          onClick={limpiar}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
        >
          <FiX size={13} />
          Limpiar filtro
        </button>
      )}
    </div>
  )
}
