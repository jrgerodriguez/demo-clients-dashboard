'use client'

import Link from "next/link"
import { FiChevronRight, FiChevronLeft, FiSearch } from 'react-icons/fi'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ClientesTabla({ clientes }) {
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState(clientes)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const router = useRouter()

  useEffect(() => {
    const term = search.toLowerCase().trim()
    const data = (!term ? clientes : clientes.filter(c =>
      (c.nombre_completo ?? "").toLowerCase().includes(term) ||
      (c.email ?? "").toLowerCase().includes(term) ||
      (c.telefono ?? "").includes(term)
    )).sort((a, b) => a.nombre_completo.toLowerCase().localeCompare(b.nombre_completo.toLowerCase()))
    setFiltered(data)
    setCurrentPage(1)
  }, [search, clientes])

  const indexOfLastItem  = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems     = filtered.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages       = Math.ceil(filtered.length / itemsPerPage)

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="space-y-5">

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 font-medium hover:bg-slate-50 transition shadow-sm"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shadow-slate-200/50">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="min-w-[600px] md:min-w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nombre</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Teléfono</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <FiSearch size={22} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">No se encontraron clientes</p>
                      <p className="text-xs text-slate-400">Intenta con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((cliente, i) => (
                  <tr
                    key={cliente.id}
                    onClick={() => router.push(`/dashboard/clientes/${cliente.id}`)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                          {cliente.nombre_completo?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                          {cliente.nombre_completo}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{cliente.telefono || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{cliente.email || '—'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Mostrando {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filtered.length)} de {filtered.length} clientes
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium text-slate-700 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
