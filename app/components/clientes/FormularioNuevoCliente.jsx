import BotonAccion from "../ui/BotonAccion"
import { FiUser } from "react-icons/fi"

export default function FormularioNuevoCliente({ onSubmit, isSubmitting, error, onChange }) {
  return (
    <form onSubmit={onSubmit} onChange={onChange} className="space-y-5">

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
          rows={4}
          placeholder="Información adicional sobre el cliente..."
          className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
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
