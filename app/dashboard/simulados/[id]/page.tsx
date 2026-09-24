import { notFound } from "next/navigation"

import { SimuladoRunner } from "@/components/simulados"
import { INITIAL_SIMULADOS } from "@/lib/simulados/constants"
import { getSimuladoQuestions } from "@/lib/simulados/exam-data"

type SimuladoRunPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function SimuladoRunPage({ params }: SimuladoRunPageProps) {
  const { id } = await params
  const simulado = INITIAL_SIMULADOS.find((item) => item.id === id)

  if (!simulado) notFound()

  return (
    <SimuladoRunner
      simulado={simulado}
      questions={getSimuladoQuestions(simulado.id)}
    />
  )
}
