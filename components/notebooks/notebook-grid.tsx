"use client"

import React from "react"
import { BookOpen } from "lucide-react"
import type { NotebookItem } from "@/lib/notebooks/types"
import { NotebookCard } from "./notebook-card"

interface NotebookGridProps {
  notebooks: NotebookItem[]
  onSelectNotebook?: (notebook: NotebookItem) => void
  onDeleteNotebook?: (id: string) => void
}

export function NotebookGrid({
  notebooks,
  onSelectNotebook,
  onDeleteNotebook,
}: NotebookGridProps) {
  if (notebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/70 bg-muted/20 my-6">
        <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">Nenhum caderno encontrado</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Nenhum caderno corresponde aos critérios de pesquisa ou categoria selecionada.
        </p>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(165px,1fr))] gap-3">
      {notebooks.map((nb) => (
        <NotebookCard
          key={nb.id}
          notebook={nb}
          onClick={onSelectNotebook}
          onDelete={onDeleteNotebook}
        />
      ))}
    </div>
  )
}
