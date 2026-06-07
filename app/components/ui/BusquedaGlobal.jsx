'use client'

import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BusquedaGlobal() {
  const [query, setQuery]       = useState('')
  const [resultados, setResultados] = useState([])
  const [loading, setLoading]   = useState(false)
  const [open, setOpen]         = useState(false)
  const router      = useRouter()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResultados([]); setOpen(false); return }

    const timeout = setTimeout(async () => {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('clientes')
        .select('id, nombre_completo, telefono, email')
        .or(`nombre_completo.ilike.%${query}%,telefono.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(6)
      setResultados(data || [])
      setOpen(true)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(id) {
    setQuery('')
    setOpen(false)
    router.push(`/dashboard/clientes/${id}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
          {loading ? (
            <div className="px-4 py-3 text-xs text-slate-400">Buscando...</div>
          ) : resultados.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400">Sin resultados para "{query}"</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {resultados.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                    {c.nombre_completo?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.nombre_completo}</p>
                    <p className="text-xs text-slate-400 truncate">{c.telefono || c.email || '—'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
