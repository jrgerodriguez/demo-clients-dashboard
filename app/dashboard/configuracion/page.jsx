import RequiereAdmin from '@/app/components/auth/RequiereAdmin'
import GestionUsuarios from '@/app/components/configuracion/GestionUsuarios'
import { obtenerUsuarios } from '@/lib/usuarios'
import { FiSettings } from 'react-icons/fi'

export default async function ConfiguracionPage() {
  return (
    <RequiereAdmin>
      <ConfiguracionContent />
    </RequiereAdmin>
  )
}

async function ConfiguracionContent() {
  const usuarios = await obtenerUsuarios()

  return (
    <div className="space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <FiSettings className="text-slate-600" size={18} />
          </div>
          Configuración
        </h1>
        <p className="text-slate-500 text-sm mt-1">Gestiona los usuarios que tienen acceso al sistema.</p>
      </div>
      <GestionUsuarios usuarios={usuarios} />
    </div>
  )
}
