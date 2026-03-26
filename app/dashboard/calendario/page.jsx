import { obtenerTodasLasCitas } from "@/lib/citas"
import { obtenerClientes } from "@/lib/clientes"
import CalendarioContainer from "@/app/components/calendario/CalendarioContainer"

export default async function CalendarioPage() {
    const citas = await obtenerTodasLasCitas()
    const clientes = await obtenerClientes()

    return (
        <section className="fade-in-up space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendario</h1>
                    <p className="text-slate-500 text-sm mt-1">Organiza y gestiona las citas de tus clientes.</p>
                </div>
            </div>

            <CalendarioContainer inicialCitas={citas} clientes={clientes} />
        </section>
    )
}
