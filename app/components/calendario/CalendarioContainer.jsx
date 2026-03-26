'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiPlus, 
  FiClock, 
  FiTrash2, 
  FiEdit 
} from 'react-icons/fi'
import Modal from '../ui/Modal'
import CitaForm from './CitaForm'
import { crearCita, editarCita, eliminarCita } from '@/lib/citas'
import { useRouter } from 'next/navigation'
import EliminarClienteModal from '../clientes/EliminarClienteModal'

// Helper to get YYYY-MM-DD in local time
const getLocalDateString = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarioContainer({ inicialCitas, clientes }) {
  const [view, setView] = useState('month') // 'month' | 'week'
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isClient, setIsClient] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCita, setSelectedCita] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  // Ensure local time on client side to avoid SSR/Vercel date mismatch
  useEffect(() => {
    setIsClient(true)
    setCurrentDate(new Date())
  }, [])

  // Helper: Get days in month
  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    // Add empty slots for the first week
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday
    for (let i = 0; i < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1); i++) {
        const d = new Date(year, month, -i)
        // days.unshift(null) // Or previous month days
    }
    
    // Simplification: just return the actual days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }, [currentDate])

  const monthLabel = currentDate.toLocaleString('es-SV', { month: 'long', year: 'numeric' })

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1)
    } else {
      newDate.setDate(currentDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1)
    } else {
      newDate.setDate(currentDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const handleDayClick = (date) => {
    setSelectedDate(getLocalDateString(date))
    setSelectedCita(null)
    setError(null)
    setIsModalOpen(true)
  }

  const handleAddCita = (date) => {
    setSelectedDate(getLocalDateString(date))
    setSelectedCita(null)
    setError(null)
    setIsModalOpen(true)
  }

  const handleEditCita = (event, cita) => {
    event.stopPropagation()
    setSelectedCita(cita)
    setError(null)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (event, cita) => {
    event.stopPropagation()
    setSelectedCita(cita)
    setError(null)
    setIsDeleteModalOpen(true)
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setError(null)
    try {
      if (selectedCita?.id) {
        await editarCita(selectedCita.id, data)
      } else {
        if (!data.cliente_id) {
          setError("Por favor selecciona un cliente")
          setIsSubmitting(false)
          return
        }
        if (!data.fecha) {
            setError("Por favor selecciona una fecha para la cita")
            setIsSubmitting(false)
            return
        }
        await crearCita(data)
      }
      setIsModalOpen(false)
      router.refresh()
    } catch (err) {
      setError(err.message || "Error al guardar la cita")
    } finally {
      setIsSubmitting(false)
    }
  }

  const onConfirmDelete = async () => {
    setError(null)
    try {
      await eliminarCita(selectedCita.id)
      setIsDeleteModalOpen(false)
      router.refresh()
    } catch (err) {
      alert("Error al eliminar la cita")
    }
  }


  // Group citas by date
  const citasByDate = useMemo(() => {
    const map = {}
    inicialCitas.forEach(cita => {
      if (!map[cita.fecha]) map[cita.fecha] = []
      map[cita.fecha].push(cita)
    })
    // Sort each day's appointments by time
    Object.keys(map).forEach(date => {
      map[date].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
    })
    return map
  }, [inicialCitas])


  // Week View Logic
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Start Monday
    startOfWeek.setDate(diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentDate])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <div className="flex items-center bg-slate-100 rounded-xl p-1 w-full sm:w-auto">
            <button 
              onClick={() => setView('month')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Mes
            </button>
            <button 
              onClick={() => setView('week')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Semana
            </button>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-200" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            {monthLabel}
          </h2>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-2">
            <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors border border-slate-200">
              <FiChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              Hoy
            </button>
            <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors border border-slate-200">
              <FiChevronRight size={18} />
            </button>
          </div>
          <button 
            onClick={() => {
              setSelectedCita(null)
              setSelectedDate(getLocalDateString(new Date()))
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus size={16} />
            <span className="hidden sm:inline">Nueva Cita</span>
            <span className="sm:hidden">Cita</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid wrapper for horizontal scroll on mobile */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden overflow-x-auto custom-scrollbar shadow-slate-200/50">
        <div className="min-w-[700px] lg:min-w-full">
          {view === 'month' ? (
            <div className="grid grid-cols-7 h-full border-b border-slate-100">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="p-3 text-center border-b border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
                </div>
              ))}

            
            {/* Generate placeholders for alignment */}
            {(() => {
                const year = currentDate.getFullYear()
                const month = currentDate.getMonth()
                const firstDay = new Date(year, month, 1)
                const startPos = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
                const placeholders = []
                for(let i=0; i<startPos; i++) placeholders.push(i)
                return placeholders.map(i => <div key={`p-${i}`} className="min-h-[120px] bg-slate-50/30 border-r border-b border-slate-100" />)
            })()}

            {daysInMonth.map(date => {
              const dateStr = getLocalDateString(date)
              const dayCitas = citasByDate[dateStr] || []
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div 
                  key={dateStr} 
                  onClick={() => handleAddCita(date)}
                  className="min-h-[120px] p-2 border-r border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group relative"
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-lg mb-1 ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 group-hover:text-blue-600'}`}>
                    {date.getDate()}
                  </span>
                  
                  <div className="space-y-1">
                    {dayCitas.map(cita => (
                      <div 
                        key={cita.id}
                        onClick={(e) => handleEditCita(e, cita)}
                        className={`group/item flex flex-col p-1.5 rounded-lg border text-[10px] leading-tight transition-all
                          ${cita.estado === 'completado' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-blue-50 border-blue-100 text-blue-700'}`}
                      >
                        <div className="flex items-center justify-between gap-1 overflow-hidden">
                          <span className="font-bold truncate">{cita.clientes?.nombre_completo || 'Cliente'}</span>
                          <div className="hidden group-hover/item:flex items-center gap-1 shrink-0">
                             <button onClick={(e) => handleDeleteClick(e, cita)} className="p-0.5 hover:text-red-600 transition-colors">
                                <FiTrash2 size={10} />
                             </button>
                          </div>
                        </div>
                        <span className="opacity-70 flex items-center gap-1 mt-0.5">
                          <FiClock size={10} /> {cita.hora_inicio.substring(0, 5)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <FiPlus size={14} />
                    </div>
                  </div>
                </div>
              )
            })}
            
            {/* Fill remaining cells */}
            {(() => {
                const year = currentDate.getFullYear()
                const month = currentDate.getMonth()
                const firstDay = new Date(year, month, 1)
                const startPos = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
                const totalCells = startPos + daysInMonth.length
                const remaining = (7 - (totalCells % 7)) % 7
                const placeholders = []
                for(let i=0; i<remaining; i++) placeholders.push(i)
                return placeholders.map(i => <div key={`r-${i}`} className="min-h-[120px] bg-slate-50/30 border-r border-b border-slate-100" />)
            })()}
          </div>
        ) : (
          <div className="flex flex-col h-full">
             <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
               {weekDays.map(date => {
                 const isToday = date.toDateString() === new Date().toDateString()
                 return (
                   <div key={date.toISOString()} className="p-4 text-center border-r border-slate-100 last:border-0">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                       {date.toLocaleDateString('es-SV', { weekday: 'short' })}
                     </p>
                     <p className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-lg ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700'}`}>
                       {date.getDate()}
                     </p>
                   </div>
                 )
               })}
             </div>
             
             <div className="grid grid-cols-7 flex-1 min-h-[500px]">
               {weekDays.map(date => {
                 const dateStr = getLocalDateString(date)
                 const dayCitas = citasByDate[dateStr] || []
                 return (
                   <div 
                    key={dateStr} 
                    onClick={() => handleAddCita(date)}
                    className="p-3 border-r border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer space-y-2"
                   >
                     {dayCitas.map(cita => (
                       <div 
                        key={cita.id}
                        onClick={(e) => handleEditCita(e, cita)}
                        className={`group/item p-3 rounded-xl border transition-all hover:shadow-md
                          ${cita.estado === 'completado' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                            : 'bg-blue-50 border-blue-100 text-blue-800'}`}
                       >
                         <div className="flex items-center justify-between mb-1.5">
                           <span className="text-[10px] font-bold opacity-60 flex items-center gap-1">
                             <FiClock size={12} /> {cita.hora_inicio.substring(0, 5)}
                           </span>
                           <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button onClick={(e) => handleEditCita(e, cita)} className="p-1 hover:text-blue-600 transition-colors">
                                <FiEdit size={12} />
                              </button>
                              <button onClick={(e) => handleDeleteClick(e, cita)} className="p-1 hover:text-red-600 transition-colors">
                                <FiTrash2 size={12} />
                              </button>
                           </div>
                         </div>
                         <p className="text-xs font-bold leading-tight line-clamp-2">
                           {cita.clientes?.nombre_completo || 'Cliente'}
                         </p>
                       </div>
                     ))}
                     <div className="flex justify-center p-2 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                          <FiPlus size={16} />
                        </div>
                     </div>
                   </div>
                 )
               })}
             </div>
          </div>
        )}
        </div>
      </div>


      {/* Appointment Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        titulo={selectedCita ? 'Editar Cita' : 'Nueva Cita'}
        mensaje={selectedCita ? 'Modifica los detalles de la cita.' : 'Completa la información para agendar la cita.'}
      >
        <CitaForm 
          initialData={selectedCita || { fecha: selectedDate }}
          clientes={clientes}
          isSubmitting={isSubmitting}
          error={error}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={onSubmit}
        />

      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        titulo="Eliminar Cita"
        mensaje="¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer."
      >
        <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-700 font-medium">
                    Vas a eliminar la cita de: <span className="font-bold">{selectedCita?.clientes?.nombre_completo}</span>
                </p>
                <p className="text-xs text-red-500 mt-1">
                    Programada para el {selectedCita?.fecha} a las {selectedCita?.hora_inicio}
                </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirmDelete}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all"
                >
                    Confirmar Eliminación
                </button>
            </div>
        </div>
      </Modal>
    </div>
  )
}
