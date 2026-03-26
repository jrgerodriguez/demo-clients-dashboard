'use client'

import { createPortal } from 'react-dom'
import BotonAccion from "../ui/BotonAccion"
import { X } from "lucide-react"
import { FiUser } from "react-icons/fi"
import { useState } from "react"

function EditarClienteFormulario({ editOpen, setEditOpen, cliente, handleSubmit, error, onChange, isSubmitting }) {
  const [nuevoNombre,    setNuevoNombre]    = useState(cliente.nombre_completo)
  const [nuevoTelefono,  setNuevoTelefono]  = useState(cliente.telefono)
  const [nuevoEmail,     setNuevoEmail]     = useState(cliente.email)
  const [nuevaDireccion, setNuevaDireccion] = useState(cliente.direccion)
  const [nuevasNotas,    setNuevasNotas]    = useState(cliente.notas || "")

  const inputClass = "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5"

  // Portal al body para escapar de cualquier transform/overflow del árbol padre
  return createPortal(
    <>
      {/* Overlay — cubre TODO el viewport (sidebar incluido) */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300
          ${editOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setEditOpen(false)}
      />

      {/* Panel derecho — siempre pegado al viewport */}
      <div
        className={`fixed top-0 right-0 h-screen w-full md:w-[480px] bg-white shadow-2xl z-50
          flex flex-col transform transition-transform duration-300 ease-out
          ${editOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <FiUser size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Editar Cliente</h2>
              <p className="text-xs text-slate-500 mt-0.5">Actualiza la información del cliente</p>
            </div>
          </div>
          <button
            onClick={() => setEditOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <form className="p-6 space-y-5" onSubmit={handleSubmit} onChange={onChange}>

            <div>
              <label className={labelClass}>Nombre Completo <span className="text-red-500">*</span></label>
              <input type="text" name="nombre" required className={inputClass}
                value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Teléfono</label>
                <input type="tel" name="telefono" className={inputClass}
                  value={nuevoTelefono} onChange={(e) => setNuevoTelefono(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Correo Electrónico</label>
                <input type="email" name="email" className={inputClass}
                  value={nuevoEmail} onChange={(e) => setNuevoEmail(e.target.value)} />
              </div>
            </div>


            <div>
              <label className={labelClass}>Dirección</label>
              <input type="text" name="direccion" className={inputClass}
                value={nuevaDireccion} onChange={(e) => setNuevaDireccion(e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Notas</label>
              <textarea name="notas" rows={5} className={`${inputClass} resize-none`}
                value={nuevasNotas} onChange={(e) => setNuevasNotas(e.target.value)} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <BotonAccion texto={isSubmitting ? "Guardando..." : "Guardar Cambios"} disabled={isSubmitting} />
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}

export default EditarClienteFormulario
