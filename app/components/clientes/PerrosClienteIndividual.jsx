'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiPlus, FiEdit, FiTrash2, FiCamera, FiX } from 'react-icons/fi'
import { PiDogBold } from 'react-icons/pi'
import Modal from '../ui/Modal'
import { crearPerro, editarPerro, eliminarPerro } from '@/lib/perros'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const hoy = new Date()
  const nac = new Date(fechaNacimiento + 'T00:00:00')
  const años = hoy.getFullYear() - nac.getFullYear()
  const meses = hoy.getMonth() - nac.getMonth()
  const totalMeses = años * 12 + meses - (hoy.getDate() < nac.getDate() ? 1 : 0)
  if (totalMeses < 12) return `${totalMeses} ${totalMeses === 1 ? 'mes' : 'meses'}`
  const a = Math.floor(totalMeses / 12)
  return `${a} ${a === 1 ? 'año' : 'años'}`
}

function formatearFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-SV', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

async function subirFotoPerro(file, perroId) {
  const supabase = createClient()
  const ext = file.name.split('.').pop()
  const path = `${perroId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('perros').upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('perros').getPublicUrl(path)
  return data.publicUrl
}

function pathDesdeUrl(fotoUrl) {
  const marker = '/perros/'
  const idx = fotoUrl.indexOf(marker)
  if (idx === -1) return null
  return fotoUrl.slice(idx + marker.length)
}

async function eliminarFotoStorage(fotoUrl) {
  const path = pathDesdeUrl(fotoUrl)
  if (!path) return
  const supabase = createClient()
  await supabase.storage.from('perros').remove([path])
}

const EMPTY_FORM = { nombre: '', raza: '', fecha_nacimiento: '' }

export default function PerrosClienteIndividual({ perros, clienteId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPerro, setSelectedPerro] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [fotoFile, setFotoFile] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoEliminada, setFotoEliminada] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fotoAmpliada, setFotoAmpliada] = useState(null)
  const router = useRouter()

  function openAdd() {
    setSelectedPerro(null)
    setForm(EMPTY_FORM)
    setFotoFile(null)
    setFotoPreview(null)
    setFotoEliminada(false)
    setError(null)
    setIsModalOpen(true)
  }

  function openEdit(perro) {
    setSelectedPerro(perro)
    setForm({ nombre: perro.nombre, raza: perro.raza || '', fecha_nacimiento: perro.fecha_nacimiento || '' })
    setFotoFile(null)
    setFotoPreview(perro.foto_url || null)
    setFotoEliminada(false)
    setError(null)
    setIsModalOpen(true)
  }

  function quitarFoto() {
    setFotoFile(null)
    setFotoPreview(null)
    setFotoEliminada(true)
  }

  function openDelete(perro) {
    setSelectedPerro(perro)
    setIsDeleteModalOpen(true)
  }

  function handleFotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFotoFile(file)
    setFotoPreview(URL.createObjectURL(file))
    setFotoEliminada(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nombre.trim()) return
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = {
        nombre: form.nombre.trim(),
        raza: form.raza.trim() || null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        cliente_id: clienteId,
      }
      let perro = selectedPerro
      if (selectedPerro) {
        await editarPerro(selectedPerro.id, payload)
      } else {
        perro = await crearPerro(payload)
      }
      if (fotoFile) {
        if (selectedPerro?.foto_url) await eliminarFotoStorage(selectedPerro.foto_url)
        const fotoUrl = await subirFotoPerro(fotoFile, perro.id)
        await editarPerro(perro.id, { foto_url: fotoUrl })
      } else if (fotoEliminada && selectedPerro?.foto_url) {
        await eliminarFotoStorage(selectedPerro.foto_url)
        await editarPerro(perro.id, { foto_url: null })
      }
      setIsModalOpen(false)
      router.refresh()
    } catch (err) {
      setError('Error al guardar el perro.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    try {
      if (selectedPerro.foto_url) await eliminarFotoStorage(selectedPerro.foto_url)
      await eliminarPerro(selectedPerro.id)
      setIsDeleteModalOpen(false)
      router.refresh()
    } catch {
      alert('Error al eliminar.')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
            <PiDogBold className="text-amber-600" size={15} />
          </div>
          Perros
        </h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <FiPlus size={14} />
          Agregar Perro
        </button>
      </div>

      {perros.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <PiDogBold size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No hay perros registrados</p>
          <p className="text-xs text-slate-400">Agrega el perro de este cliente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {perros.map(perro => (
            <div
              key={perro.id}
              className="flex flex-col gap-3 px-4 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                {perro.foto_url ? (
                  <button
                    type="button"
                    onClick={() => setFotoAmpliada(perro.foto_url)}
                    className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-200"
                  >
                    <img src={perro.foto_url} alt={perro.nombre} className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <PiDogBold className="text-amber-500" size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800">{perro.nombre}</p>
                    {perro.raza && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {perro.raza}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {perro.fecha_nacimiento && (
                      <>
                        <span className="text-xs text-slate-500">{formatearFecha(perro.fecha_nacimiento)}</span>
                        <span className="text-slate-300 text-xs">·</span>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
                          {calcularEdad(perro.fecha_nacimiento)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEdit(perro)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <FiEdit size={13} />
                  Editar
                </button>
                <button
                  onClick={() => openDelete(perro)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <FiTrash2 size={13} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agregar / Editar Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        titulo={selectedPerro ? 'Editar Perro' : 'Agregar Perro'}
        mensaje={selectedPerro ? 'Modifica los datos del perro.' : 'Ingresa los datos del perro.'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <label className="relative w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-300 transition-colors group">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Foto del perro" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500">
                  <FiCamera size={20} />
                  <span className="text-[10px] font-semibold">Foto</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
            </label>
            {fotoPreview && (
              <button
                type="button"
                onClick={quitarFoto}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Eliminar foto
              </button>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Max"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Raza</label>
            <input
              type="text"
              placeholder="Ej: Golden Retriever"
              value={form.raza}
              onChange={e => setForm(f => ({ ...f, raza: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha de Nacimiento</label>
            <input
              type="date"
              value={form.fecha_nacimiento}
              onChange={e => setForm(f => ({ ...f, fecha_nacimiento: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Eliminar Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        titulo="Eliminar Perro"
        mensaje="¿Estás seguro de que deseas eliminar este perro?"
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-700 font-medium">
              Vas a eliminar a <span className="font-bold">{selectedPerro?.nombre}</span>
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
              onClick={handleDelete}
              className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-200 transition-all"
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      </Modal>

      {/* Foto ampliada */}
      {fotoAmpliada && createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4"
          onClick={() => setFotoAmpliada(null)}
        >
          <button
            onClick={() => setFotoAmpliada(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiX size={22} />
          </button>
          <img
            src={fotoAmpliada}
            alt="Foto del perro"
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  )
}
