'use client'

import Link from "next/link"
import { FiChevronLeft, FiEdit, FiMail, FiPhone, FiMapPin, FiFileText, FiTrash2 } from 'react-icons/fi'
import { FaWhatsapp } from "react-icons/fa"
import { useState } from "react"
import EditarClienteFormulario from "./EditarClienteFormulario"
import { useParams, useRouter } from "next/navigation"
import { editarCliente, eliminarClientePorId } from "@/lib/clientes"
import CitasClienteIndividual from "./CitasClienteIndividual"
import Modal from "../ui/Modal"
import EliminarClienteModal from "./EliminarClienteModal"

export default function DetallesClienteIndividual({ cliente, citas }) {
  const [editOpen, setEditOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError]     = useState("")
  const router = useRouter()
  const { id } = useParams()

  // Manejar la funcion de editar
  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    const data = {
      nombre:    formData.get("nombre"),
      telefono:  formData.get("telefono"),
      email:     formData.get("email"),
      direccion: formData.get("direccion"),
      notas:     formData.get("notas"),
    }
    setFormError("")
    const telefono = formData.get("telefono")
    const email    = formData.get("email")
    if (telefono && !/^\d{8}$/.test(telefono)) {
      setFormError("Número de teléfono no válido o el formato es incorrecto.")
      setIsSubmitting(false)
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Correo electrónico no válido.")
      setIsSubmitting(false)
      return
    }
    try {
      await editarCliente(id, data)
      setEditOpen(false)
      router.refresh()
    } catch (error) {
      alert(error.message || "Error al editar al cliente")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Avatar placeholder
  const initials = cliente.nombre_completo
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  // Manejar el delete
    async function handleDelete() {
      try {
        await eliminarClientePorId(cliente.id)
        router.push('/dashboard/clientes')
      } catch (error) {
        alert("Error al eliminar el cliente")
      }
    }

  return (
    <section className="fade-in-up space-y-6">

      {/* Breadcrumb */}
      <Link
        href="/dashboard/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <FiChevronLeft size={18} />
        Volver a Clientes
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-sm shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {cliente.nombre_completo}
              </h1>
              <p className="text-[10px] sm:text-sm text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">Perfil del Cliente</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <a
              href={`https://wa.me/503${cliente.telefono}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <FaWhatsapp size={16} />
              <span className="sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              type="button"
            >
              <FiEdit size={15} />
              <span className="sm:inline">Editar</span>
            </button>

            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-none flex items-center justify-center p-2 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              type="button"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>


      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Contacto */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiPhone className="text-blue-600" size={14} />
            </div>
            Información de Contacto
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Teléfono</label>
              <p className="text-sm text-slate-900 font-medium">{cliente.telefono || '—'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Email</label>
              <p className="text-sm text-slate-900 font-medium break-all">{cliente.email || '—'}</p>
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
              <FiMapPin className="text-violet-600" size={14} />
            </div>
            Dirección
          </h2>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">Ubicación</label>
            <p className="text-sm text-slate-900 leading-relaxed">{cliente.direccion || '—'}</p>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <FiFileText className="text-amber-600" size={14} />
            </div>
            Notas Adicionales
          </h2>
          
          {cliente.notas ? (
            <p className="text-sm text-slate-900 leading-relaxed">{cliente.notas}</p>
          ) : (
            <p className="text-sm text-slate-400" >No hay notas adicionales para este cliente</p>
          )}
        </div>

        {/* Citas */}
        <CitasClienteIndividual citas={citas} />
      </div>

      {/* Edit panel */}
      <EditarClienteFormulario
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        cliente={cliente}
        handleSubmit={handleSubmit}
        error={formError}
        onChange={() => setFormError("")}
        isSubmitting={isSubmitting}
      />

      {/* Eliminar Cliente */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo={`Eliminar Cliente`} mensaje={"Confirmar acción."}>
          <EliminarClienteModal
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDelete}
            nombre={cliente.nombre_completo}
          />
        </Modal>
    </section>
  )
}
