"use client"

import React from "react"
import { BookOpen } from "lucide-react"

import type { SimuladoItem } from "@/lib/simulados/types"
import { SimuladoCard } from "./simulado-card"

interface SimuladoGridProps {
  simulados: SimuladoItem[]
  onStartSimulado?: (simulado: SimuladoItem) => void
}

export function SimuladoGrid({
  simulados,
  onStartSimulado,
}: SimuladoGridProps) {
  if (simulados.length === 0) {
    return (
      <div className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[18px] border border-dashed border-border/70 px-6 py-10 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
          <BookOpen className="size-4 text-muted-foreground" />
        </div>

        <h3 className="text-sm font-semibold text-foreground">
          Nenhum simulado disponível
        </h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Não há simulados cadastrados no momento.
        </p>
      </div>
    )
  }

  return (
    <div
      className="
        grid w-full
       grid-cols-[repeat(auto-fit,minmax(165px,1fr))]
        gap-3
      "
    >
      {simulados.map((item) => (
        <SimuladoCard
          key={item.id}
          simulado={item}
          onStart={onStartSimulado}
        />
      ))}
    </div>
  )
}