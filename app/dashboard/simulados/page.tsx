"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { INITIAL_SIMULADOS } from "@/lib/simulados/constants"
import type { SimuladoItem } from "@/lib/simulados/types"
import { SimuladoGrid } from "@/components/simulados"

export default function SimuladosPage() {
  const router = useRouter()
  const [simulados] = useState<SimuladoItem[]>(INITIAL_SIMULADOS)

  function handleStartSimulado(simulado: SimuladoItem) {
    router.push(`/dashboard/simulados/${simulado.id}`)
  }

  return (
    <div className="p-6 w-full">
      {/* Grid com os Cards de Simulados */}
      <SimuladoGrid
        simulados={simulados}
        onStartSimulado={handleStartSimulado}
      />
    </div>
  )
}
