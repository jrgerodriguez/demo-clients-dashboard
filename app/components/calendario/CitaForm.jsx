'use client'

import { useState } from 'react'
import { FiClock, FiFileText, FiCreditCard } from 'react-icons/fi'
import SmoothSelect from '../ui/SmoothSelect'
import CircularClock from '../ui/CircularClock'
import CustomDatePicker from '../ui/CustomDatePicker'

export default function CitaForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  clientes = [], 
  isSubmitting = false,
  fixedClienteId = null,
  error = null
}) {
  const [formData, setFormData] = useState({
    cliente_id: fixedClienteId || initialData.cliente_id || '',
    fecha: initialData.fecha || '',
    hora_inicio: initialData.hora_inicio || '09:00',
    duracion: initialData.duracion || '60',
    notas: initialData.notas || '',
    metodo_pago: initialData.metodo_pago || 'efectivo',
    estado: initialData.estado || 'pendiente'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCustomChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation is handled by parent if needed, or by required attributes
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 fade-in-up">
          <p className="text-xs text-red-600 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </p>
        </div>
      )}

      {/* Cliente Selection (if not fixed) */}

      {!fixedClienteId && (
        <SmoothSelect 
          options={clientes}
          value={formData.cliente_id}
          onChange={(val) => handleCustomChange('cliente_id', val)}
          label="Cliente"
          placeholder="Seleccionar cliente para la cita..."
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Fecha */}
        <CustomDatePicker 
          value={formData.fecha}
          onChange={(val) => handleCustomChange('fecha', val)}
          label="Fecha de Cita"
        />

        {/* Hora (Circular Clock) */}

        <CircularClock 
          value={formData.hora_inicio}
          onChange={(val) => handleCustomChange('hora_inicio', val)}
          label="Hora de Inicio"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Duración */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Duración (minutos)
          </label>
          <div className="relative">
             <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input
                type="number"
                name="duracion"
                required
                min="1"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="60"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
          </div>
        </div>

        {/* Método de Pago */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Método de Pago
          </label>
          <div className="relative">
            <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <FiClock size={14} className="opacity-0" /> {/* Spacer */}
               <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Estado de la Cita
        </label>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
           <button
            type="button"
            onClick={() => handleCustomChange('estado', 'pendiente')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.estado === 'pendiente' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Pendiente
           </button>
           <button
            type="button"
            onClick={() => handleCustomChange('estado', 'completado')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.estado === 'completado' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Completado
           </button>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
          Notas de la Consulta
        </label>
        <div className="relative">
          <FiFileText className="absolute left-3 top-3 text-slate-400" size={16} />
          <textarea
            name="notas"
            rows="3"
            value={formData.notas}
            onChange={handleChange}
            placeholder="Escribe aquí los detalles importantes para la cita..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 resize-none"
          ></textarea>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          {isSubmitting ? 'Guardando...' : initialData.id ? 'Guardar Cambios' : 'Confirmar Cita'}
        </button>
      </div>
    </form>
  )
}

