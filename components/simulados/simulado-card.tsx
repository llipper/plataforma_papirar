"use client"

import React, { useState } from "react"
import {
  FileText,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Share2,
  BookOpen,
  Info,
} from "lucide-react"

import type { SimuladoItem } from "@/lib/simulados/types"
import { SimuladoCover } from "./simulado-cover"

interface SimuladoCardProps {
  simulado: SimuladoItem
  onStart?: (simulado: SimuladoItem) => void
}

export function SimuladoCard({
  simulado,
  onStart,
}: SimuladoCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onClick={() => onStart?.(simulado)}
      className="
        group relative flex w-full flex-col
        rounded-[18px]
        border border-border/70
        bg-card p-2
        text-card-foreground
        shadow-2xs
        transition-all duration-200
        cursor-pointer select-none
        hover:border-border hover:shadow-lg
        dark:border-neutral-800/80
        dark:bg-neutral-900
        dark:text-neutral-100
        dark:hover:border-neutral-700/80
      "
    >
      {/* ================================================================
          1. CAPA
      ================================================================= */}
      <div className="h-[92px] w-full overflow-hidden rounded-[13px]">
        <SimuladoCover subject={simulado.title} />
      </div>

      {/* ================================================================
          2. CONTEÚDO
      ================================================================= */}
      <div className="flex flex-1 flex-col justify-between gap-2 px-1 pb-0.5 pt-2">
        <div>
          {/* Label */}
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
            SIMULADO
          </span>

          {/* Título + menu */}
          <div className="mt-0.5 flex items-start justify-between gap-1">
            <h3 className="min-w-0 flex-1 truncate text-[13.5px] font-bold leading-[1.25] tracking-tight text-foreground">
              {simulado.title}
            </h3>

            {/* Menu de opções */}
            <div className="relative -mr-1 shrink-0">
              <button
                type="button"
                aria-label="Opções do simulado"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuOpen((prev) => !prev)
                }}
                className="
                  rounded-full p-1
                  text-muted-foreground
                  transition-colors
                  hover:bg-muted hover:text-foreground
                  dark:text-neutral-400
                  dark:hover:bg-neutral-800/80
                  dark:hover:text-white
                "
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <>
                  {/* Fecha ao clicar fora */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpen(false)
                    }}
                  />

                  <div
                    className="
                      absolute right-0 top-6 z-40
                      w-36
                      rounded-xl
                      border border-border
                      bg-popover p-1
                      text-[11px] text-popover-foreground
                      shadow-xl
                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-neutral-200
                    "
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(false)
                        onStart?.(simulado)
                      }}
                      className="
                        flex w-full items-center gap-2
                        rounded-lg px-2 py-1.5
                        text-left
                        transition-colors
                        hover:bg-muted
                        dark:hover:bg-neutral-700/70
                      "
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Iniciar prova
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(false)
                      }}
                      className="
                        flex w-full items-center gap-2
                        rounded-lg px-2 py-1.5
                        text-left
                        transition-colors
                        hover:bg-muted
                        dark:hover:bg-neutral-700/70
                      "
                    >
                      <Info className="h-3.5 w-3.5" />
                      Ver detalhes
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(false)
                      }}
                      className="
                        flex w-full items-center gap-2
                        rounded-lg px-2 py-1.5
                        text-left
                        transition-colors
                        hover:bg-muted
                        dark:hover:bg-neutral-700/70
                      "
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Compartilhar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Nível */}
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            Nível: {simulado.difficulty}
          </p>

          {/* Descrição */}
          <p className="mt-1 line-clamp-2 text-[10px] leading-[1.45] text-muted-foreground/80">
            {simulado.description}
          </p>
        </div>

        {/* ================================================================
            3. RODAPÉ
        ================================================================= */}
        <div className="mt-auto flex items-center justify-between gap-1 pt-0.5">
          {/* Questões + duração */}
          <div className="flex min-w-0 items-center gap-2 text-[9.5px] font-normal text-muted-foreground">
            {/* Quantidade de questões */}
            <div
              className="flex shrink-0 items-center gap-0.5"
              title={`${simulado.questionsCount} questões`}
            >
              <FileText className="h-3 w-3 shrink-0 stroke-[1.5]" />

              <span>{simulado.questionsCount}</span>
            </div>

            {/* Duração */}
            <div className="flex shrink-0 items-center gap-0.5">
              <Clock className="h-3 w-3 shrink-0 stroke-[1.5]" />

              <span>{simulado.duration}</span>
            </div>
          </div>

          {/* Botão iniciar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onStart?.(simulado)
            }}
            className="
              inline-flex shrink-0 items-center
              gap-1 whitespace-nowrap
              rounded-md
              bg-neutral-900
              px-2 py-1.5
              text-[9.5px] font-medium
              tracking-tight text-white
              shadow-2xs
              transition-all duration-150
              hover:bg-neutral-800 hover:shadow-xs
              dark:bg-white
              dark:text-neutral-900
              dark:hover:bg-neutral-200
            "
          >
            <span>Iniciar</span>

            <ArrowRight className="h-2.5 w-2.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  )
}