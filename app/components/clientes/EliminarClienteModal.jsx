import { FiAlertTriangle } from 'react-icons/fi'

const EliminarClienteModal = ({ onClose, onConfirm, nombre }) => {
  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
        <div className="shrink-0 w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
          <FiAlertTriangle className="text-red-600" size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700">¿Estás seguro?</p>
          <p className="text-xs text-red-500 mt-1 leading-relaxed">
            Estás a punto de eliminar a <span className="font-bold">{nombre}</span>. Esta acción eliminará también todas sus citas y no se puede deshacer.
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Sí, eliminar
        </button>
      </div>

    </div>
  )
}

export default EliminarClienteModal