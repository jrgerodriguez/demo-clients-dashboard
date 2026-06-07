'use client'

import { useState } from 'react'
import { FiUserPlus, FiTrash2, FiShield, FiUser, FiMail } from 'react-icons/fi'
import { agregarUsuario, eliminarUsuario, cambiarRol } from '@/lib/usuarios'
import { useRouter } from 'next/navigation'
import { useRol } from '@/app/context/RolContext'

export default function GestionUsuarios({ usuarios }) {
  const [email, setEmail]   = useState('')
  const [rol, setRol]       = useState('user')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const router  = useRouter()
  const { email: miEmail } = useRol()

  async function handleAgregar(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await agregarUsuario(email.trim().toLowerCase(), rol)
      setEmail('')
      setRol('user')
      router.refresh()
    } catch (err) {
      setError(err.message?.includes('duplicate') ? 'Este email ya tiene acceso.' : 'Error al agregar usuario.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEliminar(emailUsuario) {
    if (!confirm(`¿Eliminar acceso a ${emailUsuario}?`)) return
    await eliminarUsuario(emailUsuario)
    router.refresh()
  }

  async function handleCambiarRol(emailUsuario, nuevoRol) {
    await cambiarRol(emailUsuario, nuevoRol)
    router.refresh()
  }

  return (
    <div className="space-y-6">

      {/* Agregar usuario */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
            <FiUserPlus className="text-blue-600" size={14} />
          </div>
          Agregar acceso
        </h2>
        <form onSubmit={handleAgregar} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          >
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? 'Agregando...' : 'Agregar'}
          </button>
        </form>
        {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Usuarios con acceso</h2>
          <p className="text-xs text-slate-400 mt-0.5">{usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'}</p>
        </div>
        <div className="divide-y divide-slate-50">
          {usuarios.map(u => (
            <div key={u.email} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${u.rol === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {u.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{u.email}</p>
                  {u.nombre && <p className="text-xs text-slate-400">{u.nombre}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.email === miEmail ? (
                  <span className="text-xs text-slate-400 italic px-2">Tu cuenta</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleCambiarRol(u.email, u.rol === 'admin' ? 'user' : 'admin')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        u.rol === 'admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {u.rol === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                      {u.rol === 'admin' ? 'Admin' : 'Usuario'}
                    </button>
                    <button
                      onClick={() => handleEliminar(u.email)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Eliminar acceso"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
