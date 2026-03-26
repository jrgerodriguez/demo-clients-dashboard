'use client'

import { useState, useRef, useEffect } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CustomDatePicker({ value, onChange, label = "Fecha" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(value ? new Date(value + 'T00:00:00') : new Date())
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateSelect = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const year = selected.getFullYear()
    const month = String(selected.getMonth() + 1).padStart(2, '0')
    const d = String(selected.getDate()).padStart(2, '0')
    onChange(`${year}-${month}-${d}`)
    setIsOpen(false)
  }

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  today.setHours(0,0,0,0)

  const selectedDate = value ? new Date(value + 'T00:00:00') : null
  if (selectedDate) selectedDate.setHours(0,0,0,0)

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
        {label}
      </label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full px-4 py-3 bg-white border rounded-2xl text-sm cursor-pointer transition-all shadow-sm group
          ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-slate-300'}
        `}
      >
        <div className="flex items-center gap-3">
          <FiCalendar className={`${isOpen ? 'text-blue-500' : 'text-slate-400'} group-hover:text-blue-500 transition-colors`} size={18} />
          <span className={`font-semibold ${!value ? 'text-slate-400' : 'text-slate-700'}`}>
            {value ? new Date(value + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Seleccionar fecha'}
          </span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors" />
      </div>


      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[70] p-5 w-full min-w-[300px] fade-in-up">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
              {monthNames[month]} <span className="text-slate-400 font-medium">{year}</span>
            </h3>
            <div className="flex gap-1">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrevMonth(); }}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
            </div>

          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-black text-slate-300 text-center uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (firstDayOfMonth(year, month)) }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9" />
            ))}
            {Array.from({ length: daysInMonth(year, month) }).map((_, i) => {
              const day = i + 1
              const dObj = new Date(year, month, day)
              dObj.setHours(0,0,0,0)
              const isToday = dObj.getTime() === today.getTime()
              const isSelected = selectedDate && dObj.getTime() === selectedDate.getTime()
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDateSelect(day); }}
                  className={`
                    h-9 w-full flex items-center justify-center rounded-xl text-xs font-bold transition-all
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg' : isToday ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}
                    ${isSelected ? 'scale-110 z-10' : ''}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center">
             <button 
              onClick={() => {
                const now = new Date()
                const y = now.getFullYear()
                const m = String(now.getMonth() + 1).padStart(2, '0')
                const d = String(now.getDate()).padStart(2, '0')
                onChange(`${y}-${m}-${d}`)
                setIsOpen(false)
              }}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest"
              type="button"
             >
                Ir a Hoy
             </button>
          </div>
        </div>
      )}
    </div>
  )
}
