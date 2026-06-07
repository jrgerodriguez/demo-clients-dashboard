'use client'

import { useState, useEffect } from 'react'
import { FiClock, FiFileText, FiCreditCard, FiDollarSign } from 'react-icons/fi'
import { PiDogBold } from 'react-icons/pi'
import SmoothSelect from '../ui/SmoothSelect'
import CircularClock from '../ui/CircularClock'
import CustomDatePicker from '../ui/CustomDatePicker'
import { obtenerPerrosPorCliente } from '@/lib/perros'

export default function CitaForm({
  initialData = {},
  onSubmit,
  onCancel,
  clientes = [],
  isSubmitting = false,
  fixedClienteId = null,
  perros: perrosProp = [],
  error = null
}) {
  const [formData, setFormData] = useState({
    cliente_id: fixedClienteId || initialData.cliente_id || '',
    perro_id: initialData.perro_id || '',
    fecha: initialData.fecha || '',
    hora_inicio: initialData.hora_inicio || '09:00',
    duracion: initialData.duracion || '60',
    notas: initialData.notas || '',
    metodo_pago: initialData.metodo_pago || 'efectivo',
    estado: initialData.estado || 'pendiente',
    costo: initialData.costo || ''
  })

  const [perrosDisponibles, setPerrosDisponibles] = useState(perrosProp)

  const [validationError, setValidationError] = useState('')

  // En el calendario (sin cliente fijo), carga perros cuando cambia el cliente
  useEffect(() => {
    if (fixedClienteId) return
    if (!formData.cliente_id) { setPerrosDisponibles([]); return }
    obtenerPerrosPorCliente(formData.cliente_id)
      .then(setPerrosDisponibles)
      .catch(() => setPerrosDisponibles([]))
  }, [formData.cliente_id, fixedClienteId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCustomChange = (name, value) => {
    setFormData(prev => {
      const next = { ...prev, [name]: value }
      // Al cambiar de cliente en el calendario, resetea el perro seleccionado
      if (name === 'cliente_id') next.perro_id = ''
      return next
    })
    if (name === 'fecha' && validationError) setValidationError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validar que la fecha esté seleccionada
    if (!formData.fecha) {
      setValidationError('Selecciona una fecha')
      return
    }
    
    setValidationError('')
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

      {/* Perro */}
      {perrosDisponibles.length > 0 && (
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            <PiDogBold size={13} />
            Perro
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {perrosDisponibles.map(perro => (
              <button
                key={perro.id}
                type="button"
                onClick={() => handleCustomChange('perro_id', formData.perro_id === perro.id ? '' : perro.id)}
                className={`flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all
                  ${formData.perro_id === perro.id
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-200 hover:bg-amber-50/40'}`}
              >
                <span className="text-xs font-bold text-slate-800">{perro.nombre}</span>
                {perro.raza && <span className="text-[10px] text-slate-400 mt-0.5">{perro.raza}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {!fixedClienteId && formData.cliente_id && perrosDisponibles.length === 0 && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <PiDogBold size={12} /> Este cliente no tiene perros registrados
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Fecha */}
        <div>
          <CustomDatePicker 
            value={formData.fecha}
            onChange={(val) => handleCustomChange('fecha', val)}
            label="Fecha de Cita"
          />
          {validationError && (
            <p className="text-xs text-red-600 font-bold mt-1.5 ml-1">{validationError}</p>
          )}
        </div>

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

        {/* Costo */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
            Costo ($)
          </label>
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="number"
              name="costo"
              min="0"
              step="0.01"
              value={formData.costo}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>
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
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400"></div>
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

