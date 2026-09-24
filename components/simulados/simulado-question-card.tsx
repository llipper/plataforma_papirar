"use client"

import type {
  SimuladoAlternativeKey,
  SimuladoQuestion,
} from "@/lib/simulados/types"

type SimuladoQuestionCardProps = {
  question: SimuladoQuestion
  selected?: SimuladoAlternativeKey
  onSelect: (questionId: string, alternative: SimuladoAlternativeKey) => void
}

export function SimuladoQuestionCard({
  question,
  selected,
  onSelect,
}: SimuladoQuestionCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/70 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-medium text-muted-foreground">
          <span>Questão {String(question.order).padStart(2, "0")}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{question.discipline}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{question.topic}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-foreground sm:text-base">
          {question.statement}
        </p>
      </div>

      <div className="space-y-3 p-5">
        {question.alternatives.map((alternative) => {
          const isSelected = selected === alternative.key

          return (
            <button
              key={alternative.key}
              type="button"
              onClick={() => onSelect(question.id, alternative.key)}
              className={[
                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/70 bg-background/60 hover:bg-muted/50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground",
                ].join(" ")}
              >
                {alternative.key}
              </span>
              <span className="pt-1 text-sm leading-6">{alternative.text}</span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
