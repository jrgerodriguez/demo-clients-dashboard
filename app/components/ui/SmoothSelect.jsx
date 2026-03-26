'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiChevronDown, FiCheck, FiUser } from 'react-icons/fi'

export default function SmoothSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar...",
  label = "Cliente"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)

  const selectedOption = options.find(opt => opt.id === value)
  const filteredOptions = options
    .filter(opt => opt.nombre_completo.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo))


  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm cursor-pointer transition-all
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/10 bg-white' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden text-slate-700">
          <FiUser className="text-slate-400 shrink-0" size={16} />
          <span className={`truncate ${!selectedOption ? 'text-slate-400' : 'font-medium'}`}>
            {selectedOption ? selectedOption.nombre_completo : placeholder}
          </span>
        </div>
        <FiChevronDown 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          size={16} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[60] overflow-hidden fade-in-up min-w-[240px]">
          <div className="p-2 border-b border-slate-50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                autoFocus
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No se encontraron clientes
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(opt.id)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors
                    ${value === opt.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${value === opt.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {opt.nombre_completo.charAt(0)}
                    </div>
                    <span>{opt.nombre_completo}</span>
                  </div>
                  {value === opt.id && <FiCheck size={14} />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
