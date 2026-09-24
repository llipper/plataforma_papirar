"use client"

import { useMemo, useState } from "react"
import { getDifficultyColor, getDifficultyLabel } from "@/lib/questions/constants"
import { sanitizeHtml } from "@/lib/questions/sanitizer"
import type { QuestionDifficulty, QuestionUserStatus } from "@/lib/questions/types"

import Image from "next/image"

export interface QuestionHeaderProps {
  code: string
  discipline: string
  subject?: string | null
  topic?: string | null
  supportText?: string | null
  difficulty: QuestionDifficulty | string
  isUnique?: boolean
  year?: string | number
  board?: string | null
  institution?: string | null
  career?: string | null
  educationLevel?: string | null
  userStatus?: QuestionUserStatus
  editorialStatus?: "draft" | "in_review" | "published"
}

export function QuestionHeader({
  code,
  discipline,
  subject,
  supportText,
  difficulty,
  isUnique,
  year,
  board,
  institution,
  career,
  educationLevel,
  userStatus = "none",
  editorialStatus,
}: QuestionHeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const safeSupportText = useMemo(() => sanitizeHtml(supportText), [supportText])
  const difficultyColor = getDifficultyColor(difficulty)
  const difficultyLabel = getDifficultyLabel(difficulty)

  const formattedCode = useMemo(() => {
    const raw = code.replace(/^Q/i, "").trim()
    return `Q-${raw.slice(-6).toUpperCase()}`
  }, [code])

  // Lógica para decidir se o texto precisa de truncamento (mais de 4 linhas ou longo demais)
  const needsTruncation = useMemo(() => {
    if (!safeSupportText) return false
    return safeSupportText.split("\n").length > 4 || safeSupportText.length > 250
  }, [safeSupportText])

  return (
    <div className="p-6 pb-0 space-y-4">
      {/* Linha Principal de Informações */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 font-black text-[11px] tracking-wider text-primary bg-primary/5 px-2.5 py-1.5 rounded-xl border border-primary/10 shadow-xs">
          <Image
            src="/logo.svg"
            alt="Papirar"
            width={14}
            height={14}
            className="size-3.5 object-contain dark:invert"
          />
          {formattedCode}
        </span>

        <span className="text-muted-foreground/30">|</span>

        <span className="font-semibold text-foreground/80">{discipline}</span>

        {subject && (
          <>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-muted-foreground">{subject}</span>
          </>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${difficultyColor}`}>
            {difficultyLabel}
          </span>

          {isUnique && (
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">
              Inédita
            </span>
          )}

          {editorialStatus && (
            <span className={`rounded-lg border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
              editorialStatus === "published"
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                : editorialStatus === "in_review"
                  ? "border-amber-500/20 bg-amber-500/5 text-amber-500"
                  : "border-slate-500/20 bg-slate-500/5 text-slate-400"
            }`}>
              {editorialStatus === "published" ? "Publicada" : editorialStatus === "in_review" ? "Em revisão" : "Rascunho"}
            </span>
          )}

          {userStatus === "correct" && (
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Acertou
            </span>
          )}

          {userStatus === "wrong" && (
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Errou
            </span>
          )}
        </div>
      </div>

      {/* Linha de Submetadados */}
      <div className="flex flex-wrap items-center gap-x-4 text-[11px] font-medium text-muted-foreground/60">
        {year && <span>{year}</span>}
        {board && <span>• {board}</span>}
        {institution && <span>• {institution}</span>}
        {career && <span>• {career}</span>}
        {educationLevel && <span>• {educationLevel}</span>}
      </div>

      {/* Texto de Apoio Minimalista com expansão suave */}
      {safeSupportText && (
        <div className="pt-4 mt-2 border-t border-border/40">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
              Texto de Apoio
            </span>

            <div
              className={`relative transition-all duration-300 ${
                isExpanded ? "" : needsTruncation ? "max-h-[100px] overflow-hidden" : ""
              }`}
            >
              <div
                className="text-sm text-foreground/90 leading-relaxed font-medium prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: safeSupportText }}
              />

              {needsTruncation && !isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent" />
              )}
            </div>

            {needsTruncation && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-[11px] font-bold text-primary hover:underline w-fit mt-1 cursor-pointer"
              >
                {isExpanded ? "Ver menos" : "Ver texto completo"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
