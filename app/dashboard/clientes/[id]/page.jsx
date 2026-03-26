import { notFound } from "next/navigation";
import { obtenerClientePorId } from "@/lib/clientes";
import DetallesClienteIndividual from "../../../components/clientes/DetallesClienteIndividual";
import { obtenerCitasPorCliente } from "@/lib/citas";

export default async function IndividualClientPage({params}) {
  const { id } = await params

  let cliente;
  let citas;
  try {
    cliente = await obtenerClientePorId(id)
    citas = await obtenerCitasPorCliente(id)
  } catch (error) {
    throw error 
  }

  if (!cliente) {
    notFound() 
  }

  return (
    <>
      <DetallesClienteIndividual cliente={cliente} citas={citas} />
    </>
  ) 
}