'use client'

import { useState } from 'react'
import BotonAccion from "../ui/BotonAccion"
import { FiUser, FiPlus, FiTrash2 } from "react-icons/fi"
import { PiDogBold } from 'react-icons/pi'

export default function FormularioNuevoCliente({ onSubmit, isSubmitting, error, onChange }) {
  const [perros, setPerros] = useState([])


  function agregarPerro() {
    setPerros(p => [...p, { nombre: '', raza: '', fecha_nacimiento: '' }])
  }

  function actualizarPerro(index, field, value) {
    setPerros(p => p.map((perro, i) => i === index ? { ...perro, [field]: value } : perro))
  }

  function quitarPerro(index) {
    setPerros(p => p.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    onSubmit(e, perros.filter(p => p.nombre.trim()))
  }

  return (
    <form onSubmit={handleSubmit} onChange={onChange} className="space-y-5">

      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <FiUser size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Información del Cliente</h3>
          <p className="text-xs text-slate-500">Completa los datos del nuevo cliente</p>
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          required
          placeholder="Ej: María González López"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="71234567"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dirección</label>
        <input
          type="text"
          name="direccion"
          required
          placeholder="Ej: Calle Los Jazmines, Pasaje 2, Casa #9"
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Notas</label>
        <textarea
          name="notas"
          rows={3}
          placeholder="Información adicional sobre el cliente..."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
      </div>

      {/* Perros */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <PiDogBold className="text-amber-600" size={14} />
            </div>
            <span className="text-sm font-bold text-slate-900">Perros</span>
            {perros.length > 0 && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {perros.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={agregarPerro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <FiPlus size={13} />
            Agregar perro
          </button>
        </div>

        {perros.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-3">
            Opcional — puedes agregar los perros del cliente ahora o después desde su perfil
          </p>
        )}

        <div className="space-y-3">
          {perros.map((perro, index) => (
            <div key={index} className="flex flex-col gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Max"
                    value={perro.nombre}
                    onChange={e => actualizarPerro(index, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Raza</label>
                  <input
                    type="text"
                    placeholder="Ej: Golden Retriever"
                    value={perro.raza}
                    onChange={e => actualizarPerro(index, 'raza', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    value={perro.fecha_nacimiento}
                    onChange={e => actualizarPerro(index, 'fecha_nacimiento', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => quitarPerro(index)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0 mb-0.5"
                  title="Quitar perro"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      <BotonAccion texto={isSubmitting ? "Registrando..." : "Registrar Cliente"} disabled={isSubmitting} />
    </form>
  )
}
