"use client"

import type { MouseEvent } from "react"
import { CheckCircle2, X } from "lucide-react"
import { sanitizeHtml } from "@/lib/questions/sanitizer"
import type { QuestionAlternative, QuestionStatsData } from "@/lib/questions/types"

export interface QuestionAlternativesProps {
  alternatives: QuestionAlternative[]
  selectedOption: string | null
  isSubmitted: boolean
  isProfessor?: boolean
  excludedOptions?: string[]
  hideExclude?: boolean
  hideLetter?: boolean
  smallText?: boolean
  stats?: QuestionStatsData
  onSelect: (letter: string) => void
  onToggleExclude?: (e: MouseEvent, letter: string) => void
}

export function QuestionAlternatives({
  alternatives,
  selectedOption,
  isSubmitted,
  isProfessor = false,
  excludedOptions = [],
  hideExclude = false,
  hideLetter = false,
  smallText = false,
  stats,
  onSelect,
  onToggleExclude,
}: QuestionAlternativesProps) {
  return (
    <div className={smallText ? "space-y-1" : "space-y-4"}>
      {alternatives.map((alt, i) => {
        const isSelected = selectedOption === alt.letter
        const isExcluded = excludedOptions.includes(alt.letter)
        const isCorrect = alt.isCorrect
        const showCorrect = (isSubmitted || isProfessor) && isCorrect
        const showWrong = isSubmitted && isSelected && !isCorrect
        const distribution = stats?.answerDistribution?.[alt.letter]
        const showDistribution = Boolean(distribution && (isSubmitted || isProfessor))

        return (
          <div key={alt.id ?? alt.letter ?? i} className="group flex items-center gap-2">
            {!isSubmitted && !isProfessor && !hideExclude && (
              <button
                type="button"
                onClick={(e) => onToggleExclude?.(e, alt.letter)}
                className={`p-1 rounded-full transition-all border shrink-0 cursor-pointer ${
                  isExcluded
                    ? "bg-red-500 text-white border-red-500"
                    : "text-muted-foreground border-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
                }`}
                title="Descartar alternativa"
                aria-label={`Descartar alternativa ${alt.letter}`}
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(alt.letter)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelect(alt.letter)
                }
              }}
              className={`flex-1 flex items-center gap-2.5 transition-all cursor-pointer ${
                smallText
                  ? `py-0.5 ${
                      isSubmitted
                        ? showCorrect
                          ? "text-green-700 dark:text-green-400 font-bold"
                          : showWrong
                            ? "text-red-700 dark:text-red-400 font-bold"
                            : "opacity-40"
                        : isSelected
                          ? "text-foreground font-semibold"
                          : isExcluded
                            ? "opacity-30 grayscale"
                            : "hover:text-foreground text-foreground/70"
                    }`
                  : `p-4 border-2 rounded-xl ${
                      isSubmitted
                        ? showCorrect
                          ? "bg-green-500/10 border-green-500/50 dark:bg-green-500/5"
                          : showWrong
                            ? "bg-red-500/10 border-red-500/50 dark:bg-red-500/5"
                            : "opacity-60 border-transparent bg-muted/20"
                        : isSelected
                          ? "border-primary/50 bg-primary/5 shadow-xs"
                          : isExcluded
                            ? "opacity-40 grayscale border-transparent bg-muted/10"
                            : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                    }`
              }`}
            >
              <div
                className={`flex ${
                  smallText ? "h-4.5 w-4.5" : "h-7 w-7"
                } shrink-0 items-center justify-center rounded-full text-[9px] font-black border transition-all ${
                  isSubmitted
                    ? showCorrect
                      ? "bg-green-600 text-white border-green-600"
                      : showWrong
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-muted text-muted-foreground border-border"
                    : isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-muted-foreground/40"
                }`}
              >
                {isSubmitted && showCorrect ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : hideLetter ? null : (
                  alt.letter
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div
                  className={`leading-tight transition-colors ${
                    smallText ? "text-[13px]" : "text-base"
                  } ${
                    isExcluded ? "line-through opacity-50" : ""
                  } break-words whitespace-normal`}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(alt.text) }}
                />

                {showDistribution && distribution && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-medium">
                      <span className="text-muted-foreground">
                        {distribution.responseCount.toLocaleString("pt-BR")} respostas
                      </span>
                      <span className="font-bold text-foreground">
                        {distribution.percentage}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60"
                      role="progressbar"
                      aria-label={`${alt.letter}: ${distribution.percentage}% das respostas`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={distribution.percentage}
                    >
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${
                          showCorrect ? "bg-emerald-500" : showWrong ? "bg-red-500" : "bg-primary/70"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, distribution.percentage))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
