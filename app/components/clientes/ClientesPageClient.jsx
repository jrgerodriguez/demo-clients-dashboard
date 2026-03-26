
'use client'

import ClientesTabla from "./ClientesTabla"
import BotonAccion from "../ui/BotonAccion";
import { FiUserPlus  } from "react-icons/fi";
import { useState } from "react";
import Modal from "../ui/Modal";
import FormularioNuevoCliente from "./FormularioNuevoCliente";
import crearNuevoCliente from "../../../lib/clientes";
import { useRouter } from "next/navigation";

export default function ClientesPageClient({clientes}) {

    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);

        setFormError("");

        const telefono = formData.get("telefono");
        const email = formData.get("email");

        if (telefono && !/^\d{8}$/.test(telefono)) {
        setFormError("Número de teléfono no válido.");
        setIsSubmitting(false);
        return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormError("Correo electrónico no válido.");
        setIsSubmitting(false);
        return;
        }

        const data = {
            nombre: formData.get("nombre"),
            telefono: formData.get("telefono"),
            email: formData.get("email"),
            direccion: formData.get("direccion"),
            notas: formData.get("notas")
        }

        try {
            const nuevoCliente = await crearNuevoCliente(data)
            setIsModalOpen(false)
            router.push(`/dashboard/clientes/${nuevoCliente.id}`)
        } catch (error) {
            setFormError("Error al guardar al cliente.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function borrarError() {
        setFormError("");
    }

    return (
        <section className="fade-in-up">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Clientes
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Gestiona y administra tu base de clientes
                    </p>
                </div>

                <BotonAccion 
                    texto={"Nuevo Cliente"} 
                    icono={FiUserPlus } 
                    onClick={() => setIsModalOpen(true)}
                />

            </div>

            <ClientesTabla clientes={clientes || []}/>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo={"Registrar Nuevo Cliente"} mensaje={"Completa la información del cliente para agregarlo al sistema."}>
                <FormularioNuevoCliente 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                    error={formError} 
                    onChange={borrarError} 
                />
            </Modal>

        </section>
    )
}
