"use client"

import React from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotebookHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
  onOpenCreate: () => void
  totalNotebooks: number
}

export function NotebookHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onOpenCreate,
  totalNotebooks,
}: NotebookHeaderProps) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Linha superior: Título e Botão de Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Caderno de Estudos
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              {totalNotebooks}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Organize seus materiais, anotações e seleções de questões por disciplina.
          </p>
        </div>

        <Button
          onClick={onOpenCreate}
          className="rounded-xl px-4 h-10 font-semibold gap-2 shadow-xs cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Novo Caderno
        </Button>
      </div>

      {/* Linha inferior: Busca e Categorias */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        {/* Barra de Pesquisa */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por disciplina ou título..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-border/60 bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Categorias (Filtro por pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
