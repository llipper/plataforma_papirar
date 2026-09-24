"use client"

import { useState } from "react"
import {
  AlertCircle,
  BookOpen,
  Brain,
  CheckCircle2,
  Dices,
  BookX,
  FileText,
  Flag,
  Ghost,
  Search,
  Star,
  Target,
  Video,
  ZapOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ERROR_REASONS } from "@/lib/questions/constants"

export interface QuestionActionsProps {
  isSubmitted: boolean
  selectedOption: string | null
  isCorrect?: boolean
  isProfessor?: boolean
  isSaving?: boolean
  isPending?: boolean
  isFavorited?: boolean
  selectedReason?: string | null
  showExplanation: boolean
  showStats: boolean
  commentsCount?: number
  onToggleExplanation: () => void
  onToggleStats: () => void
  onShowVideos: () => void
  onReportError: () => void
  onSubmit: () => void
  onToggleFavorite?: () => void
  onReasonSelect?: (reason: string) => void
}

// Map icon names to components para os ERROR_REASONS das constants
const REASON_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  lack_of_attention: ZapOff,
  unmastered_subject: BookX,
  trick_question: Ghost,
  text_interpretation: Search,
  forgetfulness: Brain,
  guess: Dices,
}

export function QuestionActions({
  isSubmitted,
  selectedOption,
  isCorrect,
  isProfessor = false,
  isSaving = false,
  isPending = false,
  isFavorited = false,
  selectedReason = null,
  showExplanation,
  showStats,
  commentsCount,
  onToggleExplanation,
  onToggleStats,
  onShowVideos,
  onReportError,
  onSubmit,
  onToggleFavorite,
  onReasonSelect,
}: QuestionActionsProps) {
  return (
    <div className="flex flex-col gap-4 py-3">
      {/* Botão Responder e Feedback */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="sm"
          className={`w-full sm:w-auto font-semibold rounded-lg transition-all active:scale-[0.98] px-8 h-10 shadow-none border-none cursor-pointer ${
            isSubmitted && !isPending
              ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
              : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          }`}
          onClick={onSubmit}
          disabled={isSubmitted || !selectedOption || isSaving}
        >
          {isPending ? "Resposta enviada" : isSubmitted ? "Respondido" : "Responder"}
        </Button>

        {isSubmitted && !isPending && !isProfessor && (
          <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
            {isCorrect ? (
              /* Badge de acerto arredondado */
              <div className="flex items-center gap-1.5 px-3 py-1.5  rounded-full text-green-600 dark:text-green-400 text-[10px] font-black tracking-[0.2em] uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CERTA
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {/* Badge de erro arredondado */}
                <div className="flex items-center gap-1.5 px-3 py-1.5  rounded-full text-red-600 dark:text-red-400 text-[10px] font-black tracking-[0.2em] uppercase">
                  <AlertCircle className="w-3.5 h-3.5" />
                  ERRADA
                </div>

                {/* Ícones inline de motivo de erro */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mr-1">
                    {selectedReason ? "Motivo:" : "Por que errou?"}
                  </span>
                  <div className="flex items-center gap-1">
                    {ERROR_REASONS.map((item) => {
                      const IconComponent = REASON_ICON_MAP[item.id] ?? ZapOff
                      const isSelected = selectedReason === item.label
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onReasonSelect?.(item.label)}
                          title={item.label}
                          aria-label={item.label}
                          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-red-50 border-red-200 text-red-600 shadow-xs scale-110 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400"
                              : "bg-muted/10 border-transparent text-muted-foreground hover:bg-red-50/50 hover:text-red-500 dark:hover:bg-red-950/20"
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de Ferramentas de Apoio */}
      <div className="flex items-center gap-2 py-3 border-t border-b overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-2 text-muted-foreground hover:text-primary cursor-pointer ${
              showExplanation ? "bg-primary/10 text-primary font-semibold" : ""
            }`}
            onClick={onToggleExplanation}
            disabled={!isSubmitted || isPending}
          >
            <BookOpen className="w-4 h-4" />
            Gabarito Comentado
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={onShowVideos}
          >
            <Video className="w-4 h-4" />
            Aulas
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex gap-2 text-muted-foreground hover:text-primary cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Comentários
            {typeof commentsCount === "number" && commentsCount > 0 && (
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-bold">
                {commentsCount}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-2 text-muted-foreground hover:text-primary cursor-pointer ${
              showStats ? "bg-primary/10 text-primary font-semibold" : ""
            }`}
            onClick={onToggleStats}
            disabled={!isSubmitted}
          >
            <Target className="w-4 h-4" />
            Estatísticas
          </Button>
        </div>

        {/* Ícones de Utilidade à direita */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 p-0 text-muted-foreground hover:text-red-500 rounded-full transition-colors cursor-pointer"
            title="Reportar erro"
            onClick={onReportError}
          >
            <Flag className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`w-9 h-9 p-0 rounded-full transition-colors cursor-pointer ${
              isFavorited
                ? "text-amber-500 hover:text-amber-600"
                : "text-muted-foreground hover:text-amber-500"
            }`}
            title={isFavorited ? "Remover dos favoritos" : "Favoritar questão"}
            onClick={onToggleFavorite}
          >
            <Star className={`w-4 h-4 ${isFavorited ? "fill-amber-500" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}
