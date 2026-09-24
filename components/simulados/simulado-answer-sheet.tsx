"use client"

import { CheckCircle2, Circle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { SimuladoAnswers, SimuladoQuestion } from "@/lib/simulados/types"

type SimuladoAnswerSheetProps = {
  questions: SimuladoQuestion[]
  answers: SimuladoAnswers
  currentQuestionId: string
  onSelectQuestion: (questionId: string) => void
}

export function SimuladoAnswerSheet({
  questions,
  answers,
  currentQuestionId,
  onSelectQuestion,
}: SimuladoAnswerSheetProps) {
  const answeredCount = questions.filter((question) => answers[question.id]).length

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="border-b border-border/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Acompanhamento</p>
              <h2 className="text-lg font-bold tracking-tight">Gabarito</h2>
            </div>
            <Badge variant="secondary" className="rounded-full">
              {answeredCount}/{questions.length}
            </Badge>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            As alternativas aparecem aqui automaticamente conforme você responde.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {questions.map((question) => {
            const selected = answers[question.id]
            const isCurrent = question.id === currentQuestionId

            return (
              <button
                key={question.id}
                type="button"
                onClick={() => onSelectQuestion(question.id)}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors",
                  isCurrent
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/70 bg-background/60 hover:bg-muted/60",
                ].join(" ")}
              >
                <span className="text-xs font-semibold tabular-nums">
                  {String(question.order).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1.5">
                  {selected ? (
                    <>
                      <span className="text-sm font-bold text-primary">{selected}</span>
                      <CheckCircle2 className="size-3.5 text-primary" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground">—</span>
                      <Circle className="size-3.5 text-muted-foreground/60" />
                    </>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
