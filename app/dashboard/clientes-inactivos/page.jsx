import { obtenerClientesInactivos } from "@/lib/clientes"
import Link from "next/link"
import { FiUserX, FiChevronRight, FiPhone, FiMail } from "react-icons/fi"

export default async function InactivosPage() {
    const clientes = await obtenerClientesInactivos()

    return (
        <section className="fade-in-up space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clientes Inactivos</h1>
                <p className="text-slate-500 text-sm mt-1">Clientes que no han tenido citas en los últimos 30 días.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {clientes.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiUserX className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No hay clientes inactivos</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-1">¡Buen trabajo! Todos tus clientes han tenido actividad reciente.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {clientes.map((cliente) => (
                            <Link 
                                key={cliente.id} 
                                href={`/dashboard/clientes/${cliente.id}`}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                        {cliente.nombre_completo.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {cliente.nombre_completo}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            {cliente.ultima_cita && (
                                                <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                                    Última cita: {new Date(cliente.ultima_cita + 'T00:00:00').toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                            {cliente.telefono && (
                                                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                    <FiPhone size={10} />
                                                    {cliente.telefono}
                                                </span>
                                            )}
                                            {cliente.email && (
                                                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                    <FiMail size={10} />
                                                    {cliente.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                                <FiChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
