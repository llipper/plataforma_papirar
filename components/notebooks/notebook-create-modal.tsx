"use client"

import React, { useState } from "react"
import { X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { NotebookItem, NotebookTheme } from "@/lib/notebooks/types"

interface NotebookCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (notebook: Omit<NotebookItem, "id">) => void
}

const THEME_OPTIONS: { id: NotebookTheme; label: string; color: string }[] = [
  { id: "amber", label: "Dourado", color: "#f59e0b" },
  { id: "purple", label: "Púrpura", color: "#a855f7" },
  { id: "blue", label: "Azul", color: "#3b82f6" },
  { id: "emerald", label: "Esmeralda", color: "#10b981" },
  { id: "rose", label: "Carmim", color: "#f43f5e" },
  { id: "cyan", label: "Ciano", color: "#06b6d4" },
]

export function NotebookCreateModal({
  isOpen,
  onClose,
  onCreate,
}: NotebookCreateModalProps) {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("Materiais de estudo")
  const [category, setCategory] = useState("Direito")
  const [theme, setTheme] = useState<NotebookTheme>("amber")

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    onCreate({
      title: title.trim(),
      subtitle: subtitle.trim() || "Materiais de estudo",
      category,
      materialsCount: 0,
      theme,
      accentGlowColor: THEME_OPTIONS.find((t) => t.id === theme)?.color || "#f59e0b",
      coverIllustration: theme === "amber" ? "constitution" : theme === "purple" ? "logic" : "tech",
    })

    setTitle("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-background border border-border/80 p-6 shadow-2xl space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Novo Caderno</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Título da Disciplina ou Matéria
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Direito Constitucional"
              className="w-full h-10 px-3 rounded-xl border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Subtítulo / Descrição
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Materiais de estudo, Resumos, etc."
              className="w-full h-10 px-3 rounded-xl border border-border bg-muted/20 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-muted/20 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="Direito">Direito</option>
              <option value="Exatas">Exatas</option>
              <option value="Gerais">Gerais</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Tema Visual da Capa
            </label>
            <div className="grid grid-cols-6 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  style={{ backgroundColor: opt.color }}
                  className={`h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    theme === opt.id
                      ? "ring-2 ring-primary ring-offset-2 scale-105"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl font-semibold cursor-pointer"
            >
              Criar Caderno
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
