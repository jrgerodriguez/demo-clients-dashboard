import { obtenerClientes } from "../../../lib/clientes"
import ClientesPageClient from "../../components/clientes/ClientesPageClient";

export default async function clientesPage() {

    const clientes = await obtenerClientes();

    return (
        <ClientesPageClient clientes={clientes} />
    )
}