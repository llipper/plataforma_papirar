"use client"

import { useState } from "react"
import { BookOpen, FileText, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react"
import type { NotebookItem } from "@/lib/notebooks/types"
import { NotebookCoverArt } from "./notebook-cover-art"

interface NotebookCardProps {
  notebook: NotebookItem
  onClick?: (notebook: NotebookItem) => void
  onDelete?: (id: string) => void
}

export function NotebookCard({ notebook, onClick, onDelete }: NotebookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const formattedCount = notebook.materialsCount.toLocaleString("pt-BR")

  return (
    <article onClick={() => onClick?.(notebook)} className="group relative flex w-full cursor-pointer select-none flex-col rounded-[18px] border border-border/70 bg-card p-2 text-card-foreground shadow-2xs transition-all duration-200 hover:border-border hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-700/80">
      <div className="h-[92px] w-full overflow-hidden rounded-[13px]">
        <NotebookCoverArt illustration={notebook.coverIllustration} theme={notebook.theme} />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 px-1 pb-0.5 pt-2">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">CADERNO</span>
          <div className="mt-0.5 flex items-start justify-between gap-1">
            <h3 className="min-w-0 flex-1 truncate text-[13.5px] font-bold leading-[1.25] tracking-tight text-foreground">{notebook.title}</h3>
            <div className="relative -mr-1 shrink-0">
              <button type="button" aria-label="Opções do caderno" onClick={(event) => { event.stopPropagation(); setMenuOpen((current) => !current) }} className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-white"><MoreHorizontal className="size-3.5" /></button>
              {menuOpen && <><div className="fixed inset-0 z-30" onClick={(event) => { event.stopPropagation(); setMenuOpen(false) }} /><div className="absolute right-0 top-6 z-40 w-40 rounded-xl border border-border bg-popover p-1 text-[11px] text-popover-foreground shadow-xl dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onClick?.(notebook) }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"><BookOpen className="size-3.5" />Abrir caderno</button>
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"><Pencil className="size-3.5" />Renomear</button>
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-muted"><Share2 className="size-3.5" />Compartilhar</button>
                <div className="my-1 h-px bg-border" />
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onDelete?.(notebook.id) }} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-destructive hover:bg-red-500/10"><Trash2 className="size-3.5" />Excluir caderno</button>
              </div></>}
            </div>
          </div>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{notebook.subtitle}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-1 pt-0.5 text-[9.5px] text-muted-foreground">
          <div className="flex min-w-0 items-center gap-1.5"><FileText className="size-3.5 shrink-0" /><span className="truncate">{formattedCount} materiais</span></div>
          {notebook.category && <span className="max-w-[90px] truncate rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-medium">{notebook.category}</span>}
        </div>
      </div>
    </article>
  )
}
