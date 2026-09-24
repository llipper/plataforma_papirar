"use client"

import { useCallback, useMemo, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sanitizeHtml } from "@/lib/questions/sanitizer"
import type { QuestionAnswerPayload, QuestionAnswerResult, QuestionData } from "@/lib/questions/types"
import { QuestionAlternatives } from "./question-alternatives"

export interface MinimalQuestionCardProps {
  question: QuestionData
  onAnswerSubmit?: (
    payload: QuestionAnswerPayload
  ) => Promise<QuestionAnswerResult> | QuestionAnswerResult
}

export function MinimalQuestionCard({ question, onAnswerSubmit }: MinimalQuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const supportHtml = useMemo(() => sanitizeHtml(question.supportText), [question.supportText])
  const questionHtml = useMemo(() => sanitizeHtml(question.questionText), [question.questionText])
  const resolutionHtml = useMemo(() => sanitizeHtml(question.resolution), [question.resolution])

  const correctAnswer = useMemo(
    () => question.alternatives.find((alt) => alt.isCorrect),
    [question.alternatives]
  )
  const isCorrect = selectedOption === correctAnswer?.letter

  const handleOptionSelect = useCallback(
    (letter: string) => {
      if (!isSubmitted) {
        setSelectedOption((prev) => (prev === letter ? null : letter))
      }
    },
    [isSubmitted]
  )

  const handleSubmit = useCallback(async () => {
    if (!selectedOption || isSubmitted || isSaving) return

    const selectedAlternative = question.alternatives.find(
      (alt) => alt.letter === selectedOption
    )

    setIsSaving(true)
    try {
      if (onAnswerSubmit) {
        await onAnswerSubmit({
          questionId: question.id,
          alternativeId: selectedAlternative?.id,
          alternativeLetter: selectedOption,
          timeSeconds: 0,
        })
      }
      setIsSubmitted(true)
    } finally {
      setIsSaving(false)
    }
  }, [selectedOption, isSubmitted, isSaving, question.alternatives, question.id, onAnswerSubmit])

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
      {/* 1. Disciplina */}
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 border-b border-border/40 pb-1 w-fit">
        {question.discipline}
      </div>

      {/* 2. Texto de Apoio (se houver) */}
      {supportHtml && (
        <div className="pt-1">
          <div
            className="text-[13px] text-foreground/70 leading-relaxed font-medium prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: supportHtml }}
          />
        </div>
      )}

      {/* 3. Enunciado da questão */}
      <div
        className="text-base font-bold leading-relaxed text-foreground/90 tracking-tight"
        dangerouslySetInnerHTML={{ __html: questionHtml }}
      />

      {/* 4. Alternativas em formato compacto */}
      <QuestionAlternatives
        alternatives={question.alternatives}
        selectedOption={selectedOption}
        isSubmitted={isSubmitted}
        isProfessor={false}
        hideExclude={true}
        hideLetter={true}
        smallText={true}
        onSelect={handleOptionSelect}
      />

      {/* 5. Ação de resposta */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          size="sm"
          className={`h-8 px-6 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
            isSubmitted
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.98]"
          }`}
          onClick={handleSubmit}
          disabled={isSubmitted || !selectedOption || isSaving}
        >
          {isSubmitted ? "Respondido" : isSaving ? "Salvando..." : "Responder"}
        </Button>

        {isSubmitted && (
          <div
            className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Correto
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" /> Incorreto
              </>
            )}
          </div>
        )}
      </div>

      {/* 6. Gabarito Comentado (surge automaticamente ao responder) */}
      {isSubmitted && resolutionHtml && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500 pt-4 border-t border-border/40">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">
              Gabarito Comentado
            </div>
            <div
              className="prose dark:prose-invert max-w-none text-[13px] leading-snug text-foreground/70 font-medium w-full overflow-hidden break-words whitespace-normal [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ __html: resolutionHtml }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
