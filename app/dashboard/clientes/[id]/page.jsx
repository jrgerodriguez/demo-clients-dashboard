import { notFound } from "next/navigation";
import { obtenerClientePorId } from "@/lib/clientes";
import DetallesClienteIndividual from "../../../components/clientes/DetallesClienteIndividual";
import { obtenerCitasPorCliente } from "@/lib/citas";
import { obtenerPerrosPorCliente } from "@/lib/perros";

export default async function IndividualClientPage({params}) {
  const { id } = await params

  let cliente;
  let citas = [];
  let perros = [];
  try {
    cliente = await obtenerClientePorId(id)
    ;[citas, perros] = await Promise.all([
      obtenerCitasPorCliente(id).catch(() => []),
      obtenerPerrosPorCliente(id).catch(() => []),
    ])
  } catch (error) {
    throw error
  }

  if (!cliente) {
    notFound()
  }

  return (
    <>
      <DetallesClienteIndividual cliente={cliente} citas={citas} perros={perros} />
    </>
  )
}